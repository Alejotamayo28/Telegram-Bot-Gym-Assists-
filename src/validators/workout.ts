import { Request, Response, NextFunction } from "express";
import { check } from "express-validator";
import { validateResult } from "../helpers/validateHelper";

export const validateCreateWorkout = [
    check('day').exists().isString().notEmpty(),
    check('name').exists().isString().notEmpty(),
    check('series').exists().isNumeric().notEmpty(),
    check('reps').exists().isArray().notEmpty().custom((value: any[]) => {
        return value.every((num) => typeof num === 'number')
    }),
    check('kg').exists().isNumeric().notEmpty(),
    (req: Request, res: Response, next: NextFunction) => {
        validateResult(req, res, next)
    }
]

export const validateUpdateWorkout = [
    check('day').isString().optional(),
    check('name').isString().optional(),
    check('series').isNumeric().optional(),
    check('reps').isArray().optional().custom((value: any[]) => {
        return value.every((num) => typeof num == 'number')
    }),
    check('kg').isNumeric().optional()
]
