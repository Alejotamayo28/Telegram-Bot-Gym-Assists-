import { Request, Response, NextFunction } from 'express';

export const extractData = (req: Request, res: Response, next: NextFunction): void => {
    const { day, name, series, reps, kg } = req.params as { [key: string]: string };
    next();
};
