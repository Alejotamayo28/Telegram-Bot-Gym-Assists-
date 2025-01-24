import bcrypt from "bcryptjs";

export const encrypt = async (textPlan: any) => {
  return await bcrypt.hash(textPlan, 10);
};

export const compare = async (passwordPlain: any, passwordHash: any) => {
  return await bcrypt.compare(passwordPlain, passwordHash);
};

