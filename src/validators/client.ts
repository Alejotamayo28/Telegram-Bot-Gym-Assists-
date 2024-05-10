import { check } from "express-validator";
import { validateResult } from "../helpers/validateHelper";
import { Request, Response, NextFunction } from "express";
import { verifyAge, verifyGender } from "./functions/client";

export const validateIdClient = [
    check('id').exists().isNumeric(),
    (req: Request, res: Response, next: NextFunction) => {
        validateResult(req, res, next)
    }
]
export const validateCreateClient = [
    check('nickname').exists().isString().notEmpty(),
    check('password').exists().isString().notEmpty(),
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
        return verifyGender
    }),
    check('email').isString().isEmail().optional(),
    check('weight').isNumeric().optional(),
    check('height').isNumeric().optional(),
]