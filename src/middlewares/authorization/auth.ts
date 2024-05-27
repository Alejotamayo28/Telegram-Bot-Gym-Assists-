import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv";
import { RequestExt } from "../jsonWebToken/enCryptHelper";

dotenv.config();

export const authenticateToken = (req: RequestExt, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token de autenticación no proporcionado' });
  }
  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token de autenticación inválido' });
    }
      const userPayload = decoded as RequestExt;
    req.user = userPayload
    next();
  });
}
