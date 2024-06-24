import { Response } from "express";

export const GENERAL_ERROR_HANDLER = (e: any, res: Response): Response => {
  console.error(
    `Internal server Error: ${e instanceof Error ? e.message : "Unknown"}`
  );
  return res.status(500).json({ message: "Internal Server Error" });
};

export const TIME_OUT = 5000
export function withTimeout<T>(promise: Promise<T>): Promise<T> {
  const timeOutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out')), TIME_OUT));
  return Promise.race([promise, timeOutPromise]);
}
