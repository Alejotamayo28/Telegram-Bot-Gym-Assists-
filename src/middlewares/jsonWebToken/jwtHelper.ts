import { sign, verify } from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET!

// Payload es como lo que se puede ver publicamente del usuario
export const generateToken = (email: string) => { // voy a cambiar esto
  const jwt = sign({ email }, JWT_SECRET, {
    expiresIn: "2h",
  })
  return jwt

}

export const verifyToken = (jwt: string) => {
  const isOk = verify(jwt, JWT_SECRET)
  return isOk
}
