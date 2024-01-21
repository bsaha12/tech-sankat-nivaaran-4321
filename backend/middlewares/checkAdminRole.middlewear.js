const checkAdminRole = (req, res, next) => {
    const user = req.user; 
  
    if (user && (user.role === "admin" || user.role === "super-admin")) {
      next();
    } else {
      res.status(403).json({ error: "Access denied. Insufficient privileges." });
    }
  };
  
  module.exports = { checkAdminRole };
  