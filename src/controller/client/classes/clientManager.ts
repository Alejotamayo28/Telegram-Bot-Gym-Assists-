import { PoolClient, QueryResult } from 'pg';
import { Response } from 'express';
import { compare } from 'bcryptjs';
import { GENERAL_ERROR_HANDLER } from '../../../errors';
import { generateToken } from '../../../middlewares/jsonWebToken/jwtHelper';
import { ResponseClient } from './responseManager';
import { ClientData, ClientLogin } from '../../../model/interface/client';
import { RequestExt } from '../../../middlewares/jsonWebToken/enCryptHelper';
import { SingUpClientQuery, deleteClientRecords, getClientData, updateClientData, verifyNickname } from '../../../queries/clientQueries';

export class ClientManager {
  constructor(private client: PoolClient, private req: RequestExt, private res: Response) { }
  public async singUpClient(clientData: ClientData): Promise<void> {
    try {
      const response = await verifyNickname(this.client, clientData)
      if (!response.rowCount) {
        await SingUpClientQuery(this.client, clientData)
        return ResponseClient.SingUp(this.res)
      } else return ResponseClient.clientNicknameUsed(this.res)
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res)
      console.error(`Error singing up client: `, e)
    }
  }
  public async loginClient(clientData: ClientLogin): Promise<void> {
    try {
      const response: QueryResult = await verifyNickname(this.client,
        clientData)
      const checkPassword = await compare(clientData.password, response.rows[0].password)
      if (checkPassword) {
        const token = generateToken(response.rows[0].id, clientData)
        return ResponseClient.login(this.res, response.rows[0].id, token)
      } else {
        return ResponseClient.passwordIncorrect(this.res)
      }
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res)
      console.error(`Error login client: `, e)
    }
  }
  public async clientData(): Promise<void> {
    const user = this.req.user
    try {
      if (!user) return ResponseClient.clientNotFound(this.res)
      const response = await getClientData(this.client, user.id)
      return ResponseClient.clientData(this.res, response.rows)
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res)
      console.error(`Error getting client data: `, e)
    }
  }
  public async clientUpdate(clientData: ClientData): Promise<void> {
    const user = this.req.user
    try {
      if (!user) return ResponseClient.clientNotFound(this.res)
      const { age, gender, email, weight, height } = clientData;
      const response = await getClientData(this.client, user.id)
      const data: Partial<ClientData> = {
        age: age ?? response.rows[0].age,
        gender: gender ?? response.rows[0].gender,
        email: email ?? response.rows[0].email,
        weight: weight ?? response.rows[0].weight,
        height: height ?? response.rows[0].height
      };
      await updateClientData(this.client, user.id, data)
      return ResponseClient.clientUpdated(this.res)
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res)
      console.error(`Error updating client data: `, e)
    }
  }
  public async deleteClient(): Promise<void> {
    const user = this.req.user
    try {
      if (!user) return ResponseClient.clientNotFound(this.res)
      await deleteClientRecords(this.client, user.id)
      return ResponseClient.clientDeleted(this.res, user.id)
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res)
      console.error(`Error deleting client data: `, e)
    }
  }
}


