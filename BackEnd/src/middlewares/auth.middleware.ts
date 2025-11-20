import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export interface AuthRequest extends Request {
  user?: { id: number; tipo?: string; email?: string };
}

interface DecodedToken extends JwtPayload {
  id: number;
  tipo?: string;
  email?: string;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token" });
  const parts = auth.split(" ");
  if (parts.length !== 2) return res.status(401).json({ error: "Token error" });
  const token = parts[1];
  if (!token) return res.status(401).json({ error: "Token missing" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    req.user = { id: decoded.id, tipo: decoded.tipo, email: decoded.email };
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
