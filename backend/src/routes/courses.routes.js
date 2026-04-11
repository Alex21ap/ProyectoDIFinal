const express = require('express');
const { authMiddleware } = require('../middleware/auth.middleware');
const { roleMiddleware } = require('../middleware/role.middleware');
const { readDb, writeDb, getNextId } = require('../utils/db');

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
  const db = readDb();
  return res.json(db.courses);
});

router.get('/:id', (req, res) => {
  const db = readDb();
  const course = db.courses.find((item) => Number(item.id) === Number(req.params.id));

  if (!course) {
    return res.status(404).json({ message: 'Curso no encontrado.' });
  }

  return res.json(course);
});

router.post('/', roleMiddleware(['ADMIN', 'PROFESOR']), (req, res) => {
  const { nombre, descripcion, duracion, instructor } = req.body || {};

  if (!nombre || !descripcion || !duracion || !instructor) {
    return res.status(400).json({
      message: 'nombre, descripcion, duracion e instructor son obligatorios.',
    });
  }

  const db = readDb();
  const newCourse = {
    id: getNextId(db.courses),
    nombre,
    descripcion,
    duracion,
    instructor,
  };

  db.courses.push(newCourse);
  writeDb(db);

  return res.status(201).json(newCourse);
});

router.put('/:id', roleMiddleware(['ADMIN', 'PROFESOR']), (req, res) => {
  const id = Number(req.params.id);
  const { nombre, descripcion, duracion, instructor } = req.body || {};
  const db = readDb();
  const index = db.courses.findIndex((item) => Number(item.id) === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Curso no encontrado.' });
  }

  if (!nombre || !descripcion || !duracion || !instructor) {
    return res.status(400).json({
      message: 'nombre, descripcion, duracion e instructor son obligatorios.',
    });
  }

  db.courses[index] = {
    ...db.courses[index],
    nombre,
    descripcion,
    duracion,
    instructor,
  };

  writeDb(db);
  return res.json(db.courses[index]);
});

router.delete('/:id', roleMiddleware(['ADMIN', 'PROFESOR']), (req, res) => {
  const id = Number(req.params.id);
  const db = readDb();
  const index = db.courses.findIndex((item) => Number(item.id) === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Curso no encontrado.' });
  }

  const deletedCourse = db.courses[index];
  db.courses.splice(index, 1);
  writeDb(db);

  return res.json({
    message: 'Curso eliminado correctamente.',
    course: deletedCourse,
  });
});

module.exports = router;
