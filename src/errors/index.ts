import { Response } from "express";

export const GENERAL_ERROR_HANDLER = (e: any, res: Response): Response => {
  console.error(
    `Internal server Error: ${e instanceof Error ? e.message : "Unknown"}`
  );
  return res.status(500).json({ message: "Internal Server Error" });
};
