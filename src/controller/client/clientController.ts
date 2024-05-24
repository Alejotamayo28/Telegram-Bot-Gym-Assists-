import { QueryResult } from "pg";
import { Request, Response } from "express";
import { pool } from "../../database/database";
import { GENERAL_ERROR_HANDLER } from "../../errors";
import { ResponseHandler } from "../../model/classes/responseManager";
import { ClientManager } from "../../model/classes/clientManager";
import { GET_CLIENT_NICKNAME } from "../../queries/clientQueries";
import { compare } from "bcryptjs";
import { generateToken } from "../../middlewares/jsonWebToken/jwtHelper";
import { encrypt } from "../../middlewares/jsonWebToken/enCryptHelper";


export const loginClient = async ({ body }: Request, res: Response) => {
  let client
  try {
    client = await pool.connect()
    const { nickname, password } = body
    const responseNickname: QueryResult = await client.query(GET_CLIENT_NICKNAME,
      [nickname])
    if (responseNickname.rowCount === 0) {
      return res.status(404).json({
        Message: ResponseHandler.sendIdNotFound
      })
    }
    const checkPassword = await compare(password, responseNickname.rows[0].password)
    if (checkPassword) {
      const token = generateToken(nickname)
      return res.status(200).json({
        id: responseNickname.rows[0].id,
        Token: token,
      })
    }
    else {
      return res.status(401).json({ Message: 'INVALIDE_PARAMETERS' })
    }
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res)
    console.error(e)
  }
}

export const singUpClient = async ({ body }: Request, res: Response) => {
  let client
  try {
    client = await pool.connect()
    const { nickname, password } = body
    const passwordHash = await encrypt(password)
    const response: QueryResult = await client.query(`
    INSERT INTO client (nickname, password) VALUES ($1, $2) RETURNING id`, [nickname, passwordHash])
    const data: QueryResult = await client.query(`
    SELECT * FROM client WHERE id = $1`, [response.rows[0].id])
    res.status(200).json({
      Message: 'Everything worked',
      Data: data.rows,
    })
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res)
    console.error(e)
  }
}


export const insertClientData = async ({ body }: Request, res: Response,): Promise<void> => {
  let client;
  try {
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
