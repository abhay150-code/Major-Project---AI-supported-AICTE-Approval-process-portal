const express = require('express');
const cors = require('cors');
const errorMiddleware = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AICTE Approval Portal API is running' });
});

app.use('/api/auth', authRoutes);
app.use(errorMiddleware);

module.exports = app;
