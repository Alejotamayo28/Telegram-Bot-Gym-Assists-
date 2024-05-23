import bcrypt from 'bcryptjs'

export const encrypt = async (textPlan: any) => {
  const hash = await bcrypt.hash(textPlan, 10)
  return hash
}

export const compare = async (passwordPlain: any, passwordHash: any) => {
  return await bcrypt.compare(passwordPlain, passwordHash)

}
