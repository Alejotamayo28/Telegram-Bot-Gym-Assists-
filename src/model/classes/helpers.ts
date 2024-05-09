import { PoolClient } from 'pg';
import { Response } from 'express';
import { GENERAL_ERROR_HANDLER } from '../../errors';

export class Helper {
    static async verifyWorkout(client: PoolClient, res: Response, id: string, clientWorkout: any) {
        try {
            const { day, name } = clientWorkout;
            const response = await client.query(`SELECT * FROM workout WHERE id = $1 AND DAY = $2 AND NAME = $3`, [id, day, name]);
            return response.rowCount;
        } catch (e) {
            GENERAL_ERROR_HANDLER(e, res);
            return 0;
        }
    }
}

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
