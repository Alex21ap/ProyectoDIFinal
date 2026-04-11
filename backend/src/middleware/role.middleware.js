function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No tienes permisos para esta acción.' });
    }

    return next();
  };
}

module.exports = {
  roleMiddleware,
};
