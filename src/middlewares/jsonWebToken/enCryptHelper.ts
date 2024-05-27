import bcrypt from 'bcryptjs'
import { Request} from "express";
import { JwtPayload } from "jsonwebtoken";

export const encrypt = async (textPlan: any) => {
  return await bcrypt.hash(textPlan, 10)
}

export const compare = async (passwordPlain: any, passwordHash: any) => {
  return await bcrypt.compare(passwordPlain, passwordHash)
}

export interface RequestExt extends Request {
  user?: string | JwtPayload,
  nickname?: string
}
