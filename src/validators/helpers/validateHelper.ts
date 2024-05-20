import { NextFunction } from 'express';
import { validationResult } from 'express-validator'
import { Request, Response } from 'express'

export const validateResult = (req: Request, res: Response, next: NextFunction) => {
    try {
        validationResult(req).throw()
        return next()
    } catch (err) {
        res.status(404)
        res.send(err)
    }
}
