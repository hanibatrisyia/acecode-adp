const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',      require('./src/routes/auth.routes'));
app.use('/api/users',     require('./src/routes/users.routes'));
app.use('/api/roles',     require('./src/routes/roles.routes'));
app.use('/api/knowledge', require('./src/routes/knowledge.routes'));
app.use('/api/audit',     require('./src/routes/audit.routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`SmartWork API running on port ${PORT}`));