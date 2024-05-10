import { Response } from 'express';

export class ResponseHandler {
    static sendSuccessMessage(res: Response, data: any): void {
        res.status(200).json({
            success: true,
            message: "Task successfully done",
            data: data
        });
    }
    static sendExerciseExists(res: Response): void {
        res.status(409).json({
            success: false,
            message: "Exercise already exists",
            data: null
        });
    }
    static sendIdNotFound(res: Response): void {
        res.status(404).json({
            success: false,
            message: "ID not found",
            data: null
        });
    }
    static sendIdFound(res: Response, data: any): void {
        res.status(202).json({
            success: true,
            message: "ID found",
            data: data
        });
    }
}
