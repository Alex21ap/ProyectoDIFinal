const express = require('express');
const { readDb, sanitizeUser } = require('../utils/db');
const { createToken } = require('../utils/jwt');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: 'Username y password son obligatorios.' });
  }

  const db = readDb();
  const user = db.users.find(
    (item) => item.username === username && item.password === password
  );

  if (!user) {
    return res.status(401).json({ message: 'Credenciales incorrectas.' });
  }

  const token = createToken(user);

  return res.json({
    token,
    user: sanitizeUser(user),
  });
});

router.get('/me', authMiddleware, (req, res) => {
  const db = readDb();
  const user = db.users.find((item) => Number(item.id) === Number(req.user.sub));

  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado.' });
  }

  return res.json(sanitizeUser(user));
});

module.exports = router;
