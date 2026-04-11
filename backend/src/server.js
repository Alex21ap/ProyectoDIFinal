require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const coursesRoutes = require('./routes/courses.routes');

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';

app.use(
  cors({
    origin: FRONTEND_URL,
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Backend funcionando correctamente.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/courses', coursesRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada.' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message || 'Error interno del servidor.',
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
