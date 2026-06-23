const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const upload = require('../config/multer');
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// ─────────────────────────────────────────────
// UC011 — Upload Official SOPs
// Only Executive Staff and Admin can upload
// ─────────────────────────────────────────────
router.post('/upload', auth, rbac(['admin','executive']),
  upload.single('file'), async (req, res) => {
    try {
      const { title, category, access_level, role_tags } = req.body;
      const file = req.file;

      if (!file) return res.status(400).json({ message: 'No file uploaded.' });

      // UC011 AF2 — Check for duplicate title
      const [existing] = await db.query(
        'SELECT id, version FROM knowledge_docs WHERE title = ? AND status != "archived"',
        [title]
      );

      if (existing.length > 0) {
        // Ask client to confirm version bump
        return res.status(409).json({
          message: 'Duplicate document detected.',
          existingId: existing[0].id,
          currentVersion: existing[0].version,
          action: 'confirm_new_version'
        });
      }

      // Insert new document
      const [result] = await db.query(
        `INSERT INTO knowledge_docs
         (title, file_path, file_type, category, access_level, role_tags, uploaded_by, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [
          title,
          file.path,
          file.originalname.split('.').pop(),
          category,
          access_level || 'private',
          role_tags || 'normal',
          req.user.id
        ]
      );

      // Add to validation queue (UC014)
      await db.query(
        'INSERT INTO validation_queue (doc_id, submitted_by) VALUES (?, ?)',
        [result.insertId, req.user.id]
      );

      // Audit log
      await db.query(
        'INSERT INTO audit_logs (user_id, event_type, description) VALUES (?, "upload", ?)',
        [req.user.id, `Uploaded document: ${title}`]
      );

      res.status(201).json({
        message: 'Document uploaded successfully. Pending validation.',
        docId: result.insertId
      });

    } catch (err) {
      if (err.message.includes('Invalid file format')) {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ message: 'Upload failed.', error: err.message });
    }
  }
);

// ─────────────────────────────────────────────
// UC011 AF2 — Confirm upload as new version
// ─────────────────────────────────────────────
router.post('/upload/new-version/:docId', auth, rbac(['admin','executive']),
  upload.single('file'), async (req, res) => {
    const { docId } = req.params;
    const { revision_summary } = req.body;
    const file = req.file;

    // Archive the old document
    const [old] = await db.query(
      'SELECT * FROM knowledge_docs WHERE id = ?', [docId]
    );

    await db.query(
      'INSERT INTO doc_versions (doc_id, version, file_path, revision_summary, changed_by) VALUES (?,?,?,?,?)',
      [docId, old[0].version, old[0].file_path, revision_summary, req.user.id]
    );

    const newVersion = old[0].version + 1;
    await db.query(
      'UPDATE knowledge_docs SET file_path=?, version=?, status="pending" WHERE id=?',
      [file.path, newVersion, docId]
    );

    res.json({ message: `Document updated to v${newVersion}.`, version: newVersion });
  }
);

// ─────────────────────────────────────────────
// UC012 — Capture Tacit Knowledge
// Experienced Staff only
// ─────────────────────────────────────────────
router.post('/tacit', auth, rbac(['admin','executive','experienced']),
  async (req, res) => {
    const { context_title, insight } = req.body;

    // UC012 AF1 — Incomplete fields
    if (!context_title || !insight) {
      return res.status(400).json({
        message: 'Context and Insight fields are required.'
      });
    }

    const [result] = await db.query(
      'INSERT INTO tacit_knowledge (context_title, insight, contributed_by) VALUES (?,?,?)',
      [context_title, insight, req.user.id]
    );

    // Add to validation queue
    await db.query(
      'INSERT INTO validation_queue (tacit_id, submitted_by) VALUES (?,?)',
      [result.insertId, req.user.id]
    );

    res.status(201).json({
      message: 'Tacit knowledge submitted. Entry sent for Validation.',
      id: result.insertId
    });
  }
);

// ─────────────────────────────────────────────
// UC013 — Update Workflow
// Executive Staff only
// ─────────────────────────────────────────────
router.put('/workflow/:id', auth, rbac(['admin','executive']),
  async (req, res) => {
    const { steps, change_justification, responsible_roles } = req.body;
    const { id } = req.params;

    const [existing] = await db.query(
      'SELECT * FROM workflows WHERE id = ?', [id]
    );
    if (!existing.length) return res.status(404).json({ message: 'Workflow not found.' });

    const newVersion = existing[0].version + 1;

    // Archive old version
    await db.query(
      `INSERT INTO doc_versions (doc_id, version, revision_summary, changed_by)
       VALUES (?, ?, ?, ?)`,
      [id, existing[0].version, change_justification, req.user.id]
    );

    await db.query(
      `UPDATE workflows
       SET steps=?, responsible_roles=?, change_justification=?,
           version=?, updated_by=?
       WHERE id=?`,
      [JSON.stringify(steps), responsible_roles,
       change_justification, newVersion, req.user.id, id]
    );

    res.json({ message: `Workflow updated to v${newVersion}.` });
  }
);

// ─────────────────────────────────────────────
// UC014 — Review Knowledge Submissions
// Executive Staff only
// ─────────────────────────────────────────────
router.get('/queue', auth, rbac(['admin','executive']), async (req, res) => {
  const [queue] = await db.query(
    `SELECT vq.*, u.name as submitted_by_name,
       kd.title as doc_title, kd.file_type,
       tk.context_title as tacit_title
     FROM validation_queue vq
     LEFT JOIN users u ON vq.submitted_by = u.id
     LEFT JOIN knowledge_docs kd ON vq.doc_id = kd.id
     LEFT JOIN tacit_knowledge tk ON vq.tacit_id = tk.id
     WHERE vq.status IN ('new','under_review','pending_revision')
     ORDER BY vq.created_at DESC`
  );
  res.json(queue);
});

router.patch('/queue/:id/start-review', auth, rbac(['admin','executive']),
  async (req, res) => {
    await db.query(
      'UPDATE validation_queue SET status="under_review", reviewed_by=? WHERE id=?',
      [req.user.id, req.params.id]
    );
    res.json({ message: 'Review started.' });
  }
);

// UC014 AF2 — Request Clarification
router.patch('/queue/:id/request-clarification', auth, rbac(['admin','executive']),
  async (req, res) => {
    const { notes } = req.body;
    await db.query(
      `UPDATE validation_queue
       SET status='pending_revision', reviewer_notes=?, reviewed_by=?
       WHERE id=?`,
      [notes, req.user.id, req.params.id]
    );
    res.json({ message: 'Clarification requested. Submission returned to contributor.' });
  }
);

// ─────────────────────────────────────────────
// UC015 — Approve Knowledge
// ─────────────────────────────────────────────
router.patch('/queue/:id/approve', auth, rbac(['admin','executive']),
  async (req, res) => {
    const { access_level } = req.body; // 'public' or 'private'
    const { id } = req.params;

    const [queue] = await db.query(
      'SELECT * FROM validation_queue WHERE id=?', [id]
    );
    if (!queue.length) return res.status(404).json({ message: 'Queue item not found.' });

    const item = queue[0];

    // UC015 AF1 — Permission level check handled on frontend,
    // but we enforce it here too
    if (access_level === 'public') {
      // Check if doc has sensitive markers (simplified check)
      if (item.doc_id) {
        const [doc] = await db.query(
          'SELECT title FROM knowledge_docs WHERE id=?', [item.doc_id]
        );
        const sensitiveKeywords = ['sulit','confidential','rahsia','internal only'];
        const titleLower = doc[0]?.title?.toLowerCase() || '';
        const isSensitive = sensitiveKeywords.some(k => titleLower.includes(k));
        if (isSensitive) {
          return res.status(409).json({
            message: 'Security Alert: This document contains internal information. Are you sure you want to make this Public?',
            requiresOverride: true
          });
        }
      }
    }

    // Update validation queue
    await db.query(
      'UPDATE validation_queue SET status="approved", reviewed_by=? WHERE id=?',
      [req.user.id, id]
    );

    // Update the actual document or tacit entry
    if (item.doc_id) {
      await db.query(
        'UPDATE knowledge_docs SET status="approved", access_level=? WHERE id=?',
        [access_level || 'private', item.doc_id]
      );
    } else if (item.tacit_id) {
      await db.query(
        'UPDATE tacit_knowledge SET status="approved" WHERE id=?',
        [item.tacit_id]
      );
    }

    res.json({ message: 'Knowledge approved and published successfully.' });
  }
);

// ─────────────────────────────────────────────
// UC016 — Reject Knowledge
// ─────────────────────────────────────────────
router.patch('/queue/:id/reject', auth, rbac(['admin','executive']),
  async (req, res) => {
    const { rejection_reason, allow_resubmit } = req.body;
    const { id } = req.params;

    if (!rejection_reason) {
      return res.status(400).json({ message: 'Rejection reason is required.' });
    }

    const [queue] = await db.query(
      'SELECT * FROM validation_queue WHERE id=?', [id]
    );
    const item = queue[0];

    await db.query(
      `UPDATE validation_queue
       SET status='rejected', rejection_reason=?,
           allow_resubmit=?, reviewed_by=?
       WHERE id=?`,
      [rejection_reason, allow_resubmit ?? true, req.user.id, id]
    );

    if (item.doc_id) {
      await db.query(
        'UPDATE knowledge_docs SET status="rejected" WHERE id=?',
        [item.doc_id]
      );
    } else if (item.tacit_id) {
      await db.query(
        'UPDATE tacit_knowledge SET status="rejected" WHERE id=?',
        [item.tacit_id]
      );
    }

    res.json({ message: 'Knowledge rejected. Contributor has been notified.' });
  }
);

// UC016 AF1 — Undo Rejection
router.patch('/queue/:id/undo-reject', auth, rbac(['admin','executive']),
  async (req, res) => {
    await db.query(
      'UPDATE validation_queue SET status="under_review", rejection_reason=NULL WHERE id=?',
      [req.params.id]
    );
    res.json({ message: 'Rejection undone. Entry restored to Under Review.' });
  }
);

// ─────────────────────────────────────────────
// UC017 — Job-Role Mapping
// Admin only
// ─────────────────────────────────────────────
router.post('/mapping', auth, rbac(['admin']), async (req, res) => {
  const { doc_id, roles } = req.body; // roles = ['executive','normal']

  // Delete existing mappings for this doc
  await db.query('DELETE FROM role_doc_mapping WHERE doc_id=?', [doc_id]);

  // Insert new mappings
  for (const role of roles) {
    await db.query(
      'INSERT INTO role_doc_mapping (doc_id, role, mapped_by) VALUES (?,?,?)',
      [doc_id, role, req.user.id]
    );
  }

  res.json({ message: 'Role mapping updated successfully.' });
});

// ─────────────────────────────────────────────
// UC018 — Separate Public & Private Data
// Admin and Executive
// ─────────────────────────────────────────────
router.patch('/privacy/:docId', auth, rbac(['admin','executive']),
  async (req, res) => {
    const { access_level, override_reason } = req.body;
    const { docId } = req.params;

    const [doc] = await db.query(
      'SELECT * FROM knowledge_docs WHERE id=?', [docId]
    );
    if (!doc.length) return res.status(404).json({ message: 'Document not found.' });

    // UC018 AF1 — Sensitive keyword check
    if (access_level === 'public') {
      const sensitiveWords = ['sulit','confidential','rahsia','dalaman'];
      const titleLower = doc[0].title.toLowerCase();
      const flagged = sensitiveWords.some(w => titleLower.includes(w));
      if (flagged && !override_reason) {
        return res.status(409).json({
          message: 'Automatic Scan detected sensitive internal keywords. Please provide an override reason or change to Private.',
          requiresOverride: true
        });
      }
    }

    await db.query(
      'UPDATE knowledge_docs SET access_level=? WHERE id=?',
      [access_level, docId]
    );

    res.json({ message: `Privacy setting updated to ${access_level}.` });
  }
);

// ─────────────────────────────────────────────
// UC019 — Keep One Official Version / Rollback
// ─────────────────────────────────────────────
router.get('/versions/:docId', auth, async (req, res) => {
  const [versions] = await db.query(
    `SELECT dv.*, u.name as changed_by_name
     FROM doc_versions dv
     LEFT JOIN users u ON dv.changed_by = u.id
     WHERE dv.doc_id = ?
     ORDER BY dv.version DESC`,
    [req.params.docId]
  );
  res.json(versions);
});

router.post('/rollback/:docId/:version', auth, rbac(['admin','executive']),
  async (req, res) => {
    const { docId, version } = req.params;

    const [archived] = await db.query(
      'SELECT * FROM doc_versions WHERE doc_id=? AND version=?',
      [docId, version]
    );
    if (!archived.length) return res.status(404).json({ message: 'Version not found.' });

    const [current] = await db.query(
      'SELECT * FROM knowledge_docs WHERE id=?', [docId]
    );

    // Archive current before rollback
    await db.query(
      'INSERT INTO doc_versions (doc_id, version, file_path, revision_summary, changed_by) VALUES (?,?,?,?,?)',
      [docId, current[0].version, current[0].file_path, 'Auto-archived before rollback', req.user.id]
    );

    await db.query(
      'UPDATE knowledge_docs SET file_path=?, version=?, status="approved" WHERE id=?',
      [archived[0].file_path, archived[0].version, docId]
    );

    res.json({ message: `Document rolled back to v${version} successfully.` });
  }
);

// ─────────────────────────────────────────────
// UC020 — Search & View Documents
// All authenticated users (role-filtered)
// ─────────────────────────────────────────────
router.get('/search', auth, async (req, res) => {
  const { q } = req.query;
  const userRole = req.user.role;

  // Build role filter — public users see only public docs,
  // staff see docs mapped to their role
  let roleFilter = `AND (rdm.role = ? OR kd.access_level = 'public')`;
  let params = [`%${q}%`, `%${q}%`, userRole];

  if (userRole === 'admin') {
    roleFilter = '';
    params = [`%${q}%`, `%${q}%`];
  }

  const [docs] = await db.query(
    `SELECT DISTINCT kd.id, kd.title, kd.category,
       kd.file_type, kd.access_level, kd.version,
       kd.created_at, u.name as uploaded_by_name
     FROM knowledge_docs kd
     LEFT JOIN role_doc_mapping rdm ON kd.id = rdm.doc_id
     LEFT JOIN users u ON kd.uploaded_by = u.id
     WHERE kd.status = 'approved'
       AND (kd.title LIKE ? OR kd.category LIKE ?)
       ${roleFilter}
     ORDER BY kd.created_at DESC
     LIMIT 20`,
    params
  );

  // UC020 AF1 — No results
  if (!docs.length) {
    return res.json({
      results: [],
      message: 'No documents found. Try different keywords.',
      suggestions: ['SOP', 'Cukai', 'Lesen', 'Permit']
    });
  }

  res.json({ results: docs });
});

// Get single document (serves file)
router.get('/doc/:id', auth, async (req, res) => {
  const [docs] = await db.query(
    'SELECT * FROM knowledge_docs WHERE id=? AND status="approved"',
    [req.params.id]
  );
  if (!docs.length) return res.status(404).json({ message: 'Document not found.' });

  // Log view in audit
  await db.query(
    'INSERT INTO audit_logs (user_id, event_type, description) VALUES (?, "view_doc", ?)',
    [req.user.id, `Viewed document: ${docs[0].title}`]
  );

  res.sendFile(docs[0].file_path, { root: '.' });
});

module.exports = router;