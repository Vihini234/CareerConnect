import jwt from "jsonwebtoken";

export function auth(requiredRole) {
  return (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Please log in." });

    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
      if (requiredRole && req.user.role !== requiredRole) {
        return res.status(403).json({ message: "You do not have permission." });
      }
      next();
    } catch {
      return res.status(401).json({ message: "Your session is invalid. Please log in again." });
    }
  };
}
