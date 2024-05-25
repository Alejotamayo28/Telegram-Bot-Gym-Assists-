import { Request, Response } from "express";
import { pool } from "../../database/database";
import { GENERAL_ERROR_HANDLER } from "../../errors";
import { ClientManager } from "./classes/clientManager";

export const loginClient = async ({ body }: Request, res: Response) => {
  let client
  try {
    client = await pool.connect()
    new ClientManager(client, res).loginClient(body)
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res)
    console.error(e)
  } finally {
    client && client.release()
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
  finally {
    client && client.release()
  }
}

export const clientData = async ({ params }: Request, res: Response,): Promise<void> => {
  let client;
  try {
    const { id } = params;
    client = await pool.connect();
    await new ClientManager(client, res,).clientData(id);
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
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res);
    console.error(e);
  }
  client && client.release();
};
