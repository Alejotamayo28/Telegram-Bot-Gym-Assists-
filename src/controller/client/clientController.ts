import { Request, Response } from "express";
import { RequestExt } from "../../middlewares/jsonWebToken/enCryptHelper";
import { pool } from "../../database/database";
import { GENERAL_ERROR_HANDLER } from "../../errors";
import { ClientManager } from "./classes/clientManager";


export const loginClient = async (req: RequestExt, res: Response) => {
  let client
  try {
    client = await pool.connect()
    new ClientManager(client, req, res).loginClient(req.body)
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res)
    console.error(`Error controller "loginCLient": `, e)
  } finally {
    client && client.release()
  }
}

export const singUpClient = async (req: RequestExt, res: Response) => {
  let client
  try {
    client = await pool.connect()
    new ClientManager(client, req, res).singUpClient(req.body)
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res)
    console.error(`Error controller "singUpClient": `, e)
  }
  finally {
    client && client.release()
  }
}

export const clientData = async (req: Request, res: Response,): Promise<void> => {
  let client;
  try {
    client = await pool.connect();
    await new ClientManager(client, req, res,).clientData();
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res);
    console.log(`Error controller "clientData": `, e);
  } finally {
    client && client.release();
  }
};

export const clientDataUpdate = async (req: Request, res: Response): Promise<void> => {
  let client;
  try {
    client = await pool.connect();
    await new ClientManager(client, req, res).clientUpdate(req.body);
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res);
    console.log(`Error controller "clientDataUpdate": `, e);
  } finally {
    client && client.release();
  }
};

export const clientDeleteData = async (req: Request, res: Response) => {
  let client;
  try {
    client = await pool.connect();
    await new ClientManager(client, req, res).deleteClient();
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res);
    console.error(`Error controller "clientDeleteData": `, e);
  }
  client && client.release();
};

