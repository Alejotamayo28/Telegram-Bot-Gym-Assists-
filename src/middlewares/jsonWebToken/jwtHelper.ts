import { sign, verify } from 'jsonwebtoken'
import dotenv from "dotenv";
import { ClientLogin } from '../../model/interface/client';
dotenv.config();


export const generateToken = (id: any, clientData: ClientLogin) => { 
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
