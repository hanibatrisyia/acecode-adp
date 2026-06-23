import { useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function KnowledgeBase() {
  const { user } = useAuth();
  const [tab, setTab] = useState('upload');
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    title: '', category: '', access_level: 'private', role_tags: 'normal'
  });
  const [tacit, setTacit] = useState({ context_title: '', insight: '' });
  const [message, setMessage] = useState('');

  // UC011 — Upload SOP
  const handleUpload = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('file', file);
    Object.entries(form).forEach(([k, v]) => data.append(k, v));

    try {
      const res = await API.post('/knowledge/upload', data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // UC011 AF2 — Duplicate detected
      if (res.status === 409) {
        const confirm = window.confirm(
          `Document "${form.title}" already exists (v${res.data.currentVersion}). Upload as new version?`
        );
        if (confirm) {
          const vData = new FormData();
          vData.append('file', file);
          vData.append('revision_summary', 'Updated version');
          await API.post(`/knowledge/upload/new-version/${res.data.existingId}`, vData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
          setMessage('New version uploaded successfully.');
        }
        return;
      }
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed.');
    }
  };

  // UC012 — Submit Tacit Knowledge
  const handleTacit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/knowledge/tacit', tacit);
      setMessage(res.data.message);
      setTacit({ context_title: '', insight: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Submission failed.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ color: '#0A4D92', marginBottom: '1.5rem' }}>
        Knowledge Management
      </h2>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem',
                    borderBottom: '2px solid #E2E8F0' }}>
        {['upload','tacit','queue','search'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              padding: '.6rem 1rem', border: 'none', background: 'none',
              fontWeight: 600, cursor: 'pointer',
              color: tab === t ? '#0A4D92' : '#64748B',
              borderBottom: tab === t ? '2px solid #0A4D92' : '2px solid transparent',
              marginBottom: -2
            }}>
            {t === 'upload' ? '📤 Upload SOP' :
             t === 'tacit'  ? '💡 Tacit Knowledge' :
             t === 'queue'  ? '📋 Validation Queue' : '🔍 Search'}
          </button>
        ))}
      </div>

      {message && (
        <div style={{ padding: '.75rem', background: '#EBF3FB',
                      borderLeft: '4px solid #1C75BC',
                      borderRadius: 6, marginBottom: '1rem',
                      fontSize: '.875rem' }}>
          {message}
        </div>
      )}

      {/* UC011 — Upload SOP */}
      {tab === 'upload' && (
        <form onSubmit={handleUpload}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 600,
                            fontSize: '.85rem', marginBottom: '.3rem' }}>
              Document Title *
            </label>
            <input className="form-input" required
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              placeholder="e.g. SOP Cukai Tanah 2025" />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 600,
                            fontSize: '.85rem', marginBottom: '.3rem' }}>
              Category
            </label>
            <input className="form-input"
              value={form.category}
              onChange={e => setForm({...form, category: e.target.value})}
              placeholder="e.g. Tax, Permit, Complaint" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem',
                        marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600,
                              fontSize: '.85rem', marginBottom: '.3rem' }}>
                Access Level
              </label>
              <select className="form-select"
                value={form.access_level}
                onChange={e => setForm({...form, access_level: e.target.value})}>
                <option value="private">Private (Staff only)</option>
                <option value="public">Public</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600,
                              fontSize: '.85rem', marginBottom: '.3rem' }}>
                Role Access
              </label>
              <select className="form-select"
                value={form.role_tags}
                onChange={e => setForm({...form, role_tags: e.target.value})}>
                <option value="normal">All Staff</option>
                <option value="experienced">Experienced & Above</option>
                <option value="executive">Executive Only</option>
                <option value="admin">Admin Only</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 600,
                            fontSize: '.85rem', marginBottom: '.3rem' }}>
              File (PDF, DOCX, XLSX only) *
            </label>
            <input type="file" accept=".pdf,.docx,.xlsx" required
              onChange={e => setFile(e.target.files[0])}
              style={{ width: '100%', padding: '.6rem',
                       border: '1px solid #E2E8F0', borderRadius: 4 }} />
            <div style={{ fontSize: '.75rem', color: '#64748B', marginTop: '.3rem' }}>
              Max file size: 20MB. Invalid formats will be rejected (UC011 AF1).
            </div>
          </div>

          <button type="submit" className="btn-primary"
            style={{ padding: '.7rem', borderRadius: 6, cursor: 'pointer' }}>
            Submit for Validation
          </button>
        </form>
      )}

      {/* UC012 — Tacit Knowledge */}
      {tab === 'tacit' && (
        <form onSubmit={handleTacit}>
          <div style={{ background: '#EBF3FB', padding: '1rem',
                        borderRadius: 8, marginBottom: '1.25rem',
                        fontSize: '.85rem', color: '#0369A1' }}>
            💡 Share your field experience, workarounds, or practical tips that
            aren't in any official document. This will be reviewed before publishing.
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 600,
                            fontSize: '.85rem', marginBottom: '.3rem' }}>
              Context / Situation *
            </label>
            <input className="form-input" required
              value={tacit.context_title}
              onChange={e => setTacit({...tacit, context_title: e.target.value})}
              placeholder="e.g. When handling late tax payment appeals..." />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 600,
                            fontSize: '.85rem', marginBottom: '.3rem' }}>
              Your Insight / Experience *
            </label>
            <textarea className="form-input" required rows={5}
              value={tacit.insight}
              onChange={e => setTacit({...tacit, insight: e.target.value})}
              placeholder="Describe the practical approach, tip, or lesson learned..."
              style={{ resize: 'vertical' }} />
          </div>
          <button type="submit" className="btn-primary"
            style={{ padding: '.7rem', borderRadius: 6, cursor: 'pointer' }}>
            Submit Tip for Validation
          </button>
        </form>
      )}

      {/* UC014/015/016 — Validation Queue */}
      {tab === 'queue' && <ValidationQueue />}

      {/* UC020 — Search */}
      {tab === 'search' && <DocumentSearch userRole={user.role} />}
    </div>
  );
}

// ─────────────────────────────────────────────
// UC014/015/016 — Validation Queue Component
// ─────────────────────────────────────────────
function ValidationQueue() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useState(() => {
    API.get('/knowledge/queue')
      .then(r => { setQueue(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const approve = async (id) => {
    const level = window.confirm('Make this document Public?') ? 'public' : 'private';
    await API.patch(`/knowledge/queue/${id}/approve`, { access_level: level });
    setQueue(q => q.filter(i => i.id !== id));
  };

  const reject = async (id) => {
    const reason = window.prompt('Reason for rejection:');
    if (!reason) return;
    await API.patch(`/knowledge/queue/${id}/reject`,
      { rejection_reason: reason, allow_resubmit: true });
    setQueue(q => q.filter(i => i.id !== id));
  };

  const requestClarification = async (id) => {
    const notes = window.prompt('Notes for contributor:');
    if (!notes) return;
    await API.patch(`/knowledge/queue/${id}/request-clarification`, { notes });
    setQueue(q => q.map(i => i.id === id ? {...i, status: 'pending_revision'} : i));
  };

  if (loading) return <p>Loading queue...</p>;
  if (!queue.length) return (
    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
      ✅ No pending submissions in the validation queue.
    </div>
  );

  return (
    <div>
      {queue.map(item => (
        <div key={item.id} style={{
          background: '#fff', border: '1px solid #E2E8F0',
          borderRadius: 8, padding: '1.25rem', marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
                        alignItems: 'flex-start', marginBottom: '.75rem' }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: '.25rem' }}>
                {item.doc_title || item.tacit_title || 'Untitled'}
              </div>
              <div style={{ fontSize: '.8rem', color: '#64748B' }}>
                Submitted by {item.submitted_by_name} ·{' '}
                {new Date(item.created_at).toLocaleDateString()}
              </div>
            </div>
            <span style={{
              padding: '.2rem .65rem', borderRadius: 999,
              fontSize: '.72rem', fontWeight: 700,
              background: item.status === 'new' ? '#E0F2FE' : '#FEF3C7',
              color: item.status === 'new' ? '#0369A1' : '#92400E'
            }}>
              {item.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
            <button onClick={() => approve(item.id)}
              style={{ padding: '.45rem 1rem', background: '#10B981',
                       color: '#fff', border: 'none', borderRadius: 6,
                       fontWeight: 600, cursor: 'pointer', fontSize: '.83rem' }}>
              ✓ Approve & Publish
            </button>
            <button onClick={() => requestClarification(item.id)}
              style={{ padding: '.45rem 1rem', background: '#F59E0B',
                       color: '#fff', border: 'none', borderRadius: 6,
                       fontWeight: 600, cursor: 'pointer', fontSize: '.83rem' }}>
              ? Request Clarification
            </button>
            <button onClick={() => reject(item.id)}
              style={{ padding: '.45rem 1rem', background: '#EF4444',
                       color: '#fff', border: 'none', borderRadius: 6,
                       fontWeight: 600, cursor: 'pointer', fontSize: '.83rem' }}>
              ✕ Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// UC020 — Document Search Component
// ─────────────────────────────────────────────
function DocumentSearch({ userRole }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    try {
      // First try semantic search via FastAPI
      const res = await API.get(
        `http://localhost:8000/search?q=${encodeURIComponent(query)}&user_role=${userRole}`
      );
      setResults(res.data.results || []);
    } catch {
      // Fallback to Node.js keyword search
      const res = await API.get(`/knowledge/search?q=${encodeURIComponent(query)}`);
      setResults(res.data.results || []);
    }
    setSearched(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '.75rem', marginBottom: '1.5rem' }}>
        <input className="form-input" style={{ flex: 1, marginBottom: 0 }}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder="Search knowledge base... (e.g. cukai tanah, permit)" />
        <button onClick={search} className="btn-primary"
          style={{ padding: '.6rem 1.25rem', borderRadius: 6,
                   cursor: 'pointer', whiteSpace: 'nowrap' }}>
          Search
        </button>
      </div>

      {searched && results.length === 0 && (
        <div style={{ color: '#64748B', fontSize: '.875rem', textAlign: 'center',
                      padding: '2rem' }}>
          No documents found. Try: SOP, Cukai, Lesen, Permit
        </div>
      )}

      {results.map((doc, i) => (
        <div key={i} style={{
          background: '#fff', border: '1px solid #E2E8F0',
          borderRadius: 8, padding: '1rem 1.25rem', marginBottom: '.75rem',
          cursor: 'pointer', transition: 'box-shadow .15s'
        }}
          onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.08)'}
          onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
          onClick={() => window.open(`/api/knowledge/doc/${doc.doc_id}`, '_blank')}
        >
          <div style={{ fontWeight: 700, color: '#0A4D92', marginBottom: '.3rem' }}>
            {doc.title}
          </div>
          {doc.excerpt && (
            <div style={{ fontSize: '.82rem', color: '#64748B', marginBottom: '.5rem' }}>
              {doc.excerpt}
            </div>
          )}
          <span style={{
            fontSize: '.72rem', fontWeight: 700, padding: '.2rem .5rem',
            borderRadius: 4, background: doc.access_level === 'public' ? '#D1FAE5' : '#E0F2FE',
            color: doc.access_level === 'public' ? '#065F46' : '#0369A1'
          }}>
            {doc.access_level === 'public' ? '🌐 Public' : '🔒 Internal'}
          </span>
        </div>
      ))}
    </div>
  );
}