import { sign, verify } from 'jsonwebtoken'
import dotenv from "dotenv";
import { UserCredentials } from '../../model/client';
dotenv.config();

export const generateToken = (id: any, clientData: UserCredentials) => {
  const { nickname } = clientData
  const jwt = sign({
    id: id,
    nickname: nickname
  }, process.env.JWT_SECRET!, {
    expiresIn: "2h",
  })
  return jwt
}

export const verifyToken = (jwt: string) => {
  const isOk = verify(jwt, process.env.JWT_SECRET!)
  return isOk
}
