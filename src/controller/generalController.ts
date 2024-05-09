import { Request, Response } from 'express';
import { pool } from '../database/database';
import { ClientManager, WorkoutManager } from '../model/classes';
import { ResponseHandler, Helper } from '../model/classes/helpers';
import { GENERAL_ERROR_HANDLER } from '../errors';
import { QueryResult } from 'pg';

export const insertClientData = async (req: Request, res: Response): Promise<void> => {
    let client;
    try {
        const { body } = req;
        client = await pool.connect();
        await ClientManager.insertClient(client, res, body);
        ResponseHandler.sendSuccessMessage(res, body);
    } catch (e) {
        GENERAL_ERROR_HANDLER(e, res);
        console.error(e);
    } finally {
        client && client.release();
    }
};

export const insertWorkout = async (req: Request, res: Response): Promise<void> => {
    let client;
    try {
        const { body, params } = req;
        const { id } = params;
        client = await pool.connect();
        if (await Helper.verifyWorkout(client, res, id, body) !== 0) {
            ResponseHandler.sendExerciseExists(res);
        } else {
            await WorkoutManager.insertWorkout(client, res, id, body);
            ResponseHandler.sendSuccessMessage(res, body);
        }
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
        const { rowCount, rows }: QueryResult = await ClientManager.clientData(client, res, id);
        if (rowCount === 0) {
            ResponseHandler.sendIdNotFound(res);
        } else {
            ResponseHandler.sendIdFound(res, rows);
        }
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
        await ClientManager.clientUpdate(client, id, body);
        ResponseHandler.sendSuccessMessage(res, body);
    } catch (e) {
        GENERAL_ERROR_HANDLER(e, res);
        console.log(e);
    } finally {
        client && client.release();
    }
};
