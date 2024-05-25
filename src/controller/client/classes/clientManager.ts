import { PoolClient, QueryResult } from 'pg';
import { Response } from 'express';
import { compare } from 'bcryptjs';
import { GENERAL_ERROR_HANDLER } from '../../../errors';
import { encrypt } from '../../../middlewares/jsonWebToken/enCryptHelper';
import { generateToken } from '../../../middlewares/jsonWebToken/jwtHelper';
import { ResponseClient } from './responseManager';
import { ClientData, ClientLogin } from '../../../model/interface/client';
import * as query from "../../../queries/clientQueries"


export class ClientManager {
  constructor(private client: PoolClient, private res: Response) { }
  public async singUpClient(clientData: ClientData) {
    try {
      const { ...data } = clientData
      const passwordHash = await encrypt(data.password)
      const responseId: QueryResult = await this.client.query(query.INSERT_CLIENT_QUERY,
        [data.nickname, passwordHash])
      await this.client.query(query.INSERT_CLIENT_DATA_QUERY,
        [responseId.rows[0].id, data.age, data.gender, data.email, data.weight, data.height])
      return ResponseClient.SingUp(this.res)
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res)
      console.error(e)
    }
  }
  public async loginClient(clientData: ClientLogin) {
    try {
      const { nickname, password } = clientData
      const response: QueryResult = await this.client.query(query.GET_CLIENT_NICKNAME, [nickname])
      if (!response.rowCount) {
        return ResponseClient.clientNotFound(this.res)
      }
      const checkPassword = await compare(password, response.rows[0].password)
      if (checkPassword) {
        const token = generateToken(nickname)
        return ResponseClient.login(this.res, response.rows[0].id, token)
      } else {
        return ResponseClient.passwordIncorrect(this.res)
      }
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res)
      console.error(e)
    }
  }
  public async clientData(id: string): Promise<any> {
    try {
      const response = await this.client.query(query.GET_CLIENT_DATA, [id])
      if (response.rowCount === 0) return ResponseClient.clientNotFound(this.res)
      return ResponseClient.clientData(this.res, response.rows)
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res)
      console.error(e)
    }
  }
  public async clientUpdate(id: string, clientData: ClientData): Promise<void> {
    try {
      const { age, gender, email, weight, height } = clientData;
      const response = await this.client.query(query.GET_CLIENT_DATA,
        [id])
      const data = {
        age: age ?? response.rows[0].age,
        gender: gender ?? response.rows[0].gender,
        email: email ?? response.rows[0].email,
        weight: weight ?? response.rows[0].weight,
        height: height ?? response.rows[0].height
      };
      await this.client.query(query.UPDATE_CLIENT_DATA,
        [data.age, data.gender, data.email, data.weight, data.height, id])
      return ResponseClient.clientUpdated(this.res)
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res)
      console.error(e)
    }
  }
  public async deleteClient(id: any) {
    try {
      Promise.all([
        await this.client.query(query.DELETE_CLIENT_DATA, [id]),
        await this.client.query(query.DELETE_CLIENT_RECORDS, [id]),
        await this.client.query(query.DELETE_CLIENT, [id])
      ])
      return ResponseClient.clientDeleted(this.res, id)
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res)
      console.error(e)
    }
  }
}

export const getClientNickname = async (client: PoolClient, res: Response, nickname: string) => {
  try {
    const response = await client.query(`select * from client where nickname = $1`, [nickname])
    return response
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res)
    console.error(e)
  }
}
