import { QueryResult } from "pg";
import { Request, Response } from "express";
import { pool } from "../../database/database";
import { GENERAL_ERROR_HANDLER } from "../../errors";
import { ResponseHandler } from "../../model/classes/responseManager";
import { ClientManager } from "../../model/classes/clientManager";

export const loginClient = async ({ body }: Request, res: Response) => {
  let client
  try {
    client = await pool.connect()
    new ClientManager(client, res).loginClient(body)
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res)
    console.error(e)
  }
}

export const singUpClient = async ({ body }: Request, res: Response) => {
  let client
  try {
    client = await pool.connect()
    new ClientManager(client, res).singUpClient(body)
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res)
    console.error(e)
  }
}

export const clientData = async ({ params }: Request, res: Response,): Promise<void> => {
  let client;
  try {
    const { id } = params;
    client = await pool.connect();
    const { rowCount, rows }: QueryResult = await new ClientManager(client, res,).clientData(id);
    if (!rowCount) ResponseHandler.sendIdNotFound(res);
    if (rowCount) ResponseHandler.sendIdFound(res, rows);
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res);
    console.log(e);
  } finally {
    client && client.release();
  }
};
export const clientDataUpdate = async ({ body, params }: Request, res: Response): Promise<void> => {
  let client;
  try {
    const { id } = params;
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
export const clientDeleteData = async ({ params }: Request, res: Response) => {
  let client;
  try {
    client = await pool.connect();
    const { id } = params;
    await new ClientManager(client, res).deleteClient(id);
    ResponseHandler.sendSuccessMessage(res, id);
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res);
    console.error(e); ByteLengthQueuingStrategy
  }
  client && client.release();
};
