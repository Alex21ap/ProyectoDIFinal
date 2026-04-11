const { verifyToken } = require('../utils/jwt');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no enviado o formato inválido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
}

module.exports = {
  authMiddleware,
};
