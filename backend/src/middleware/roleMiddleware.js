function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Allowed role(s): ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
}

module.exports = { requireRole };
