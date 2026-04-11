const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data/db.json');

function readDb() {
  const content = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(content);
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

function getNextId(items) {
  if (!Array.isArray(items) || items.length === 0) return 1;
  return Math.max(...items.map((item) => Number(item.id) || 0)) + 1;
}

module.exports = {
  DB_PATH,
  readDb,
  writeDb,
  sanitizeUser,
  getNextId,
};
