import { PoolClient, QueryResult } from 'pg';
import { Response } from 'express';
import { compare } from 'bcryptjs';
import { GENERAL_ERROR_HANDLER, withTimeout } from '../../../errors';
import { generateToken } from '../../../middlewares/jsonWebToken/jwtHelper';
import { ResponseClient } from './responseManager';
import { ClientData, ClientLogin } from '../../../model/interface/client';
import { RequestExt } from '../../../middlewares/jsonWebToken/enCryptHelper';
import { SingUpClientQuery, deleteClientRecords, getClientData, updateClientData, verifyNickname } from '../../../queries/clientQueries';

export class ClientManager {
  constructor(private client: PoolClient, private req: RequestExt, private res: Response) { }
  public async singUpClient(clientData: ClientData): Promise<void | Response<any>> {
    try {
      await withTimeout(SingUpClientQuery(this.client, clientData))
      return ResponseClient.SingUp(this.res)
    } catch (e) {
      if (e instanceof Error && e.message === `Request timed out`) {
        return this.res.status(504).json({ error: `Request timed out` });
      }
      return GENERAL_ERROR_HANDLER(e, this.res)
    }
  }
  public async loginClient(clientData: ClientLogin): Promise<void | Response<any>> {
    try {
      const response: QueryResult = await withTimeout(verifyNickname(this.client, clientData))
      if (!response.rowCount) return ResponseClient.nicknameIncorrect(this.res)
      const checkPassword = await compare(clientData.password, response.rows[0].password)
      if (checkPassword) {
        const token = generateToken(response.rows[0].id, clientData)
        return ResponseClient.login(this.res, response.rows[0].id, token)
      }
      return ResponseClient.passwordIncorrect(this.res)
    } catch (e) {
      if (e instanceof Error && e.message === `Request timed out`) {
        return this.res.status(504).json({ error: `Request timed out` });
      }
      return GENERAL_ERROR_HANDLER(e, this.res)
    }
  }
  public async clientData(): Promise<void | Response<any>> {
    const user = this.req.user
    try {
      if (!user) return ResponseClient.clientNotFound(this.res)
      const response = await withTimeout(getClientData(this.client, user.id))
      return ResponseClient.clientData(this.res, response.rows)
    } catch (e) {
      if (e instanceof Error && e.message === `Request timed out`) {
        return this.res.status(504).json({ error: `Request timed out` });
      }
      return GENERAL_ERROR_HANDLER(e, this.res)
    }
  }
  public async clientUpdate(clientData: ClientData): Promise<void | Response<any>> {
    const user = this.req.user
    try {
      if (!user) return ResponseClient.clientNotFound(this.res)
      const { first_name, last_name, age, gender, email, weight, height } = clientData;
      const response = await withTimeout(getClientData(this.client, user.id))
      const data: Partial<ClientData> = {
        first_name: first_name ?? response.rows[0].first_name,
        last_name: last_name ?? response.rows[0].last_name,
        age: age ?? response.rows[0].age,
        gender: gender ?? response.rows[0].gender,
        email: email ?? response.rows[0].email,
        weight: weight ?? response.rows[0].weight,
        height: height ?? response.rows[0].height,
      };
      await withTimeout(updateClientData(this.client, user.id, data))
      return ResponseClient.clientUpdated(this.res)
    } catch (e) {
      if (e instanceof Error && e.message === `Request timed out`) {
        return this.res.status(504).json({ error: `Request timed out` });
      }
      return GENERAL_ERROR_HANDLER(e, this.res)
    }
  }
  public async deleteClient(): Promise<void | Response<any>> {
    const user = this.req.user
    try {
      if (!user) return ResponseClient.clientNotFound(this.res)
      await withTimeout(deleteClientRecords(this.client, user.id))
      return ResponseClient.clientDeleted(this.res, user.id)
    } catch (e) {
      if (e instanceof Error && e.message === `Request timed out`) {
        return this.res.status(504).json({ error: `Request timed out` });
      }
      return GENERAL_ERROR_HANDLER(e, this.res)
    }
  }
}


