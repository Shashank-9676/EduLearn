import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "secret";


export const authMiddleware = (req, res, next) => {
  let token = null;

  // Try to read from header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Or from cookie
  if (!token && req.cookies?.jwt_token) {
    token = req.cookies.jwt_token;
  }

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.user_id, role: decoded.role, username: decoded.username };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


export const rbacMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      console.log(req.user)
      return res.status(403).json({ message: "User role missing" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden: insufficient permissions" });
    }
    next();
  };
};
