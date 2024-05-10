import { Request, Response } from 'express';
import { pool } from '../database/database';
import { ClientManager } from '../model/classes/client/generalClasses';
import { ResponseHandler } from '../model/classes/responseClasses';
import { GENERAL_ERROR_HANDLER } from '../errors';
import { QueryResult } from 'pg';
import { WorkoutManager } from '../model/classes/workout/generalClasses';


export const insertClientData = async (req: Request, res: Response): Promise<void> => {
    let client;
    try {
        const { body } = req;
        client = await pool.connect();
        await new ClientManager(client, res).insertClient(body);
        ResponseHandler.sendSuccessMessage(res, body);
    } catch (e) {
        GENERAL_ERROR_HANDLER(e, res);
        console.error(e);
    } finally {
        client && client.release();
    }
};
export const clientData = async (req: Request, res: Response): Promise<void> => {
    let client;
    try {
        const { id } = req.params;
        client = await pool.connect();
        const { rowCount, rows }: QueryResult = await new ClientManager(client, res).clientData(id);
        if (!rowCount) ResponseHandler.sendIdNotFound(res);
        if (rowCount) ResponseHandler.sendIdFound(res, rows);
    } catch (e) {
        GENERAL_ERROR_HANDLER(e, res);
        console.log(e);
    } finally {
        client && client.release();
    }
};
export const clientDataUpdate = async (req: Request, res: Response): Promise<void> => {
    let client;
    try {
        const { id } = req.params;
        const { body } = req;
        client = await pool.connect();
        await new ClientManager(client, res).clientUpdate(id, body);
        ResponseHandler.sendSuccessMessage(res, body);
    } catch (e) {
        GENERAL_ERROR_HANDLER(e, res);
        console.log(e);
    } finally {
        client && client.release();
    }
};
export const clientDeleteData = async (req: Request, res: Response) => {
    let client
    try {
        client = await pool.connect()
        const { id } = req.params
        await new ClientManager(client, res).deleteClient(id)
        ResponseHandler.sendSuccessMessage(res, id)
    } catch (e) {
        GENERAL_ERROR_HANDLER(e, res)
        console.error(e)
    }
    client && client.release()
}


export const insertWorkout = async (req: Request, res: Response): Promise<void> => {
    let client;
    try {
        const { body, params } = req;
        const { id } = params;
        client = await pool.connect();
        if (await new WorkoutManager(client, res).verifyWorkout(id, body) !== 0) {
            ResponseHandler.sendExerciseExists(res);
        } else {
            await new WorkoutManager(client, res).insertWorkout(id, body);
            ResponseHandler.sendSuccessMessage(res, body);
        }
    } catch (e) {
        GENERAL_ERROR_HANDLER(e, res);
        console.error(e);
    } finally {
        client && client.release();
    }
};



