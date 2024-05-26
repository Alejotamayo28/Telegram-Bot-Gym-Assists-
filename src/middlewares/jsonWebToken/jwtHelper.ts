import { sign, verify } from 'jsonwebtoken'
import dotenv from "dotenv";
dotenv.config();



// Payload es como lo que se puede ver publicamente del usuario
export const generateToken = (email: string) => { // voy a cambiar esto
  const jwt = sign({ email }, process.env.JWT_SECRET!, {
    expiresIn: "2h",
  })
  return jwt
}

export const verifyToken = (jwt: string) => {
  const isOk = verify(jwt, process.env.JWT_SECRET!)
  return isOk
}
