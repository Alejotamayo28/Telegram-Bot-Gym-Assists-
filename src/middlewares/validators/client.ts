import { check } from "express-validator";
import { validateResult } from "./helpers/validateHelper";
import { Request, Response, NextFunction } from "express";
import { nicknameVerificationSingUp, passwordLength, verifyAge, verifyGender } from "./functions/client";

export const validateCreateClient = [
  check('nickname').exists().isString().notEmpty().custom((value, { }) => {
    return nicknameVerificationSingUp(value)
  }),
  check('password').exists().isString().notEmpty().custom((value, { }) => {
    return passwordLength(value)
  })
]
export const validateLoginClient = [
  check('nickname').exists().isString(),
  check('password').exists().isString().notEmpty()
]
export const validateCreateClientData = [
  check('age').exists().isNumeric().notEmpty().custom((value, { }) => {
    return verifyAge(value)
  }),
  check('gender').exists().isString().notEmpty().custom((value, { }) => {
    return verifyGender(value)
  }),
  check('email').exists().isString().isEmail().notEmpty(),
  check('weight').exists().isNumeric().notEmpty(),
  check('height').exists().isNumeric().notEmpty(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]
export const validateUpdateClientData = [
  check('age').isNumeric().optional().custom((value, { }) => {
    return verifyAge(value)
  }),
  check('gender').isString().optional().custom((value, { }) => {
    return verifyGender(value)
  }),
  check('email').isString().isEmail().optional(),
  check('weight').isNumeric().optional(),
  check('height').isNumeric().optional(),
]
