import { PoolClient, QueryResult } from 'pg';
import { Response } from 'express';
import { compare } from 'bcryptjs';
import { GENERAL_ERROR_HANDLER } from '../../../errors';
import { generateToken } from '../../../middlewares/jsonWebToken/jwtHelper';
import { ResponseClient } from './responseManager';
import { ClientData, ClientLogin } from '../../../model/interface/client';
import * as query from "../../../queries/clientQueries"

export class ClientManager {
  constructor(private client: PoolClient, private res: Response) { }
  public async singUpClient(clientData: ClientData): Promise<void> {
    try {
      const response = await query.verifyNickname(this.client, clientData)
      if (!response.rowCount) {
        await query.SingUpClientQuery(this.client, clientData)
        return ResponseClient.SingUp(this.res)
      } else return ResponseClient.clientNicknameUsed(this.res)
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res)
      console.error(`Error singing up client: `, e)
    }
  }
  public async loginClient(clientData: ClientLogin): Promise<void> {
    try {
      const response: QueryResult = await query.verifyNickname(this.client,
        clientData)
      if (!response.rowCount) return ResponseClient.clientNotFound(this.res)
      const checkPassword = await compare(clientData.password, response.rows[0].password)
      if (checkPassword) {
        const token = generateToken(clientData.nickname)
        return ResponseClient.login(this.res, response.rows[0].id, token)
      } else {
        return ResponseClient.passwordIncorrect(this.res)
      }
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res)
      console.error(`Error login client: `, e)
    }
  }
  public async clientData(id: string): Promise<any> {
    try {
      const response = await this.client.query(query.GET_CLIENT_DATA, [id])
      if (response.rowCount === 0) return ResponseClient.clientNotFound(this.res)
      return ResponseClient.clientData(this.res, response.rows)
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res)
      console.error(`Error getting client data: `, e)
    }
  }
  public async clientUpdate(id: string, clientData: ClientData): Promise<void> {
    try {
      const { age, gender, email, weight, height } = clientData;
      const response = await query.getClientData(this.client, id)
      type OmitTwo<T, K1 extends keyof T, K2 extends keyof T> = Omit<T, K1 | K2>;
      const data: OmitTwo<ClientData, 'password', 'nickname'> = {
        age: age ?? response.rows[0].age,
        gender: gender ?? response.rows[0].gender,
        email: email ?? response.rows[0].email,
        weight: weight ?? response.rows[0].weight,
        height: height ?? response.rows[0].height
      };
      await query.updateClientData(this.client, response.rows[0].id, data)
      return ResponseClient.clientUpdated(this.res)
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res)
      console.error(`Error updating client data: `, e)
    }
  }
  public async deleteClient(id: any) {
    try {
      await query.deleteClientRecords(this.client, id)
      return ResponseClient.clientDeleted(this.res, id)
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res)
      console.error(`Error deleting client data: `, e)
    }
  }
}


