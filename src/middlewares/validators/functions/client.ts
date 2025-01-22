import { clientGender } from "../enums/client";
import { pool } from "../../../database/database";

export const verifyAge = (age: number): boolean => {
  if (age < 8 || age > 100) {
    throw new Error("Age out of range (8-100)");
  }
  return true;
};

export const verifyGender = (gender: string): boolean => {
  if (Object.values(clientGender).includes(gender as clientGender)) {
    return true;
  }
  throw new Error("Type your gender (Male/Female/Other)");
};

export const passwordLength = (password: string): boolean => {
  const PASSWORD_LENGTH = 10;
  if (password.length < PASSWORD_LENGTH) {
    throw new Error(`Password length short`);
  }
  return true;
};

export const nicknameVerificationSingUp = async (
  nickname: string,
): Promise<boolean> => {
  const verifyNickname = await pool.query(
    `Select * from client where nickname = $1`,
    [nickname],
  );
  if (verifyNickname.rowCount != 0) {
    throw new Error(`Nickname already used`);
  }
  return true;
};
