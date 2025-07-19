module.exports = function (roles = []) {
  // roles param can be a single role string (e.g. 'admin') or an array of roles (e.g. ['admin', 'user'])
  if (typeof roles === 'string') {
    roles = [roles];
  }
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }
    next();
  };
}; 