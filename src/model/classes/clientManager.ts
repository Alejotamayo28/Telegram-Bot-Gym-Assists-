import { PoolClient, QueryResult } from 'pg';
import { Response } from 'express';
import { GENERAL_ERROR_HANDLER } from '../../errors';
import { ClientData, ClientLogin } from '../interface/client';
import { DELETE_CLIENT, DELETE_CLIENT_DATA, DELETE_CLIENT_RECORDS, GET_CLIENT_DATA, GET_CLIENT_NICKNAME, UPDATE_CLIENT_DATA } from '../../queries/clientQueries';
import { ResponseHandler } from './responseManager';
import { compare } from 'bcryptjs';
import { generateToken } from '../../middlewares/jsonWebToken/jwtHelper';
import { encrypt } from '../../middlewares/jsonWebToken/enCryptHelper';

export class ClientManager {
  constructor(private client: PoolClient, private res: Response) { }
  public async singUpClient(clientData: ClientData) {
    try {
      const { ...data } = clientData
      const passwordHash = await encrypt(data.password)
      const responseId: QueryResult = await this.client.query(`
      INSERT INTO client (nickname, password) VALUES ($1, $2) RETURNING id`,
        [data.nickname, passwordHash])
      await this.client.query(`
    INSERT INTO client_data (id, age, gender, email, weight, height) VALUES ($1,$2,$3,$4,$5,$6)`,
        [responseId.rows[0].id, data.age, data.gender, data.email, data.weight, data.height])
      return this.res.status(200).json({ Message: `Client_Created` })
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res)
      console.error(e)
    }
  }
  public async loginClient(clientData: ClientLogin) {
    try {
      const { nickname, password } = clientData
      const response: QueryResult = await this.client.query(GET_CLIENT_NICKNAME, [nickname])
      if (!response.rowCount) return this.res.status(404).json({ Message: ResponseHandler.sendIdNotFound })
      const checkPassword = await compare(password, response.rows[0].password)
      if (checkPassword) {
        const token = generateToken(nickname)
        return this.res.status(200).json({ id: response.rows[0].id, Token: token })
      } else return this.res.status(401).json({ Message: "Password_Invalided" })
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res)
      console.error(e)
    }
  }
  public async clientData(id: string): Promise<any> {
    try {
      const response = await this.client.query(GET_CLIENT_DATA,
        [id])
      return response
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res)
      console.error(e)
    }
  }
  public async clientUpdate(id: string, clientData: ClientData): Promise<void> {
    try {
      const { age, gender, email, weight, height } = clientData;
      const response = await this.client.query(GET_CLIENT_DATA,
        [id])
      const data = {
        age: age ?? response.rows[0].age,
        gender: gender ?? response.rows[0].gender,
        email: email ?? response.rows[0].email,
        weight: weight ?? response.rows[0].weight,
        height: height ?? response.rows[0].height
      };
      await this.client.query(UPDATE_CLIENT_DATA,
        [data.age, data.gender, data.email, data.weight, data.height, id])
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res)
      console.error(e)
    }
  }
  public async deleteClient(id: any) {
    try {
      Promise.all([
        await this.client.query(DELETE_CLIENT_DATA, [id]),
        await this.client.query(DELETE_CLIENT_RECORDS, [id]),
        await this.client.query(DELETE_CLIENT, [id])
      ])
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res)
      console.error(e)
    }
  }
}

// Mientras tanto --> cambiar despues 

export const getClientNickname = async (client: PoolClient, res: Response, nickname: string) => {
  try {
    const response = await client.query(`select * from client where nickname = $1`, [nickname])
    return response
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res)
    console.error(e)
  }
}
