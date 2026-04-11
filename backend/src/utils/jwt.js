const jwt = require('jsonwebtoken');

function getSecret() {
  return process.env.JWT_SECRET || 'clave-super-secreta-para-demo';
}

function createToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      username: user.username,
      role: user.role,
    },
    getSecret(),
    { expiresIn: '8h' }
  );
}

function verifyToken(token) {
  return jwt.verify(token, getSecret());
}

module.exports = {
  createToken,
  verifyToken,
};
