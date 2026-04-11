const express = require('express');
const { authMiddleware } = require('../middleware/auth.middleware');
const { roleMiddleware } = require('../middleware/role.middleware');
const { readDb, writeDb, sanitizeUser, getNextId } = require('../utils/db');

const router = express.Router();
const VALID_ROLES = ['ADMIN', 'PROFESOR', 'ESTUDIANTE'];

router.use(authMiddleware);

router.get('/', roleMiddleware('ADMIN'), (req, res) => {
  const db = readDb();
  return res.json(db.users.map(sanitizeUser));
});

router.get('/:id', roleMiddleware('ADMIN'), (req, res) => {
  const db = readDb();
  const user = db.users.find((item) => Number(item.id) === Number(req.params.id));

  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado.' });
  }

  return res.json(sanitizeUser(user));
});

router.post('/', roleMiddleware('ADMIN'), (req, res) => {
  const { username, email, role, password } = req.body || {};

  if (!username || !email || !role) {
    return res.status(400).json({ message: 'username, email y role son obligatorios.' });
  }

  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ message: 'Rol inválido.' });
  }

  const db = readDb();
  const usernameExists = db.users.some((item) => item.username === username);
  const emailExists = db.users.some((item) => item.email === email);

  if (usernameExists) {
    return res.status(409).json({ message: 'El username ya existe.' });
  }

  if (emailExists) {
    return res.status(409).json({ message: 'El email ya existe.' });
  }

  const newUser = {
    id: getNextId(db.users),
    username,
    email,
    role,
    password: password || '123456',
  };

  db.users.push(newUser);
  writeDb(db);

  return res.status(201).json(sanitizeUser(newUser));
});

router.put('/:id', roleMiddleware('ADMIN'), (req, res) => {
  const id = Number(req.params.id);
  const { username, email, role, password } = req.body || {};
  const db = readDb();
  const index = db.users.findIndex((item) => Number(item.id) === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Usuario no encontrado.' });
  }

  if (!username || !email || !role) {
    return res.status(400).json({ message: 'username, email y role son obligatorios.' });
  }

  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ message: 'Rol inválido.' });
  }

  const usernameExists = db.users.some((item) => item.username === username && Number(item.id) !== id);
  const emailExists = db.users.some((item) => item.email === email && Number(item.id) !== id);

  if (usernameExists) {
    return res.status(409).json({ message: 'El username ya existe.' });
  }

  if (emailExists) {
    return res.status(409).json({ message: 'El email ya existe.' });
  }

  db.users[index] = {
    ...db.users[index],
    username,
    email,
    role,
    password: password || db.users[index].password,
  };

  writeDb(db);
  return res.json(sanitizeUser(db.users[index]));
});

router.delete('/:id', roleMiddleware('ADMIN'), (req, res) => {
  const id = Number(req.params.id);
  const db = readDb();
  const index = db.users.findIndex((item) => Number(item.id) === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Usuario no encontrado.' });
  }

  const deletedUser = db.users[index];
  db.users.splice(index, 1);
  writeDb(db);

  return res.json({
    message: 'Usuario eliminado correctamente.',
    user: sanitizeUser(deletedUser),
  });
});

module.exports = router;
