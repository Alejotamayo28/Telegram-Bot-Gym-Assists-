import { PoolClient, QueryResult } from 'pg';
import { Response } from 'express';
import { GENERAL_ERROR_HANDLER } from '../../errors';
import { ClientData } from '../interface/client';
import { DELETE_CLIENT, DELETE_CLIENT_DATA, DELETE_CLIENT_RECORDS, GET_CLIENT_DATA, INSERT_CLIENT_DATA_QUERY, INSERT_CLIENT_QUERY, UPDATE_CLIENT_DATA } from '../../queries/clientQueries';

export class ClientManager {
    constructor(private client: PoolClient, private res: Response) { }
    public async insertClient(clientData: ClientData) {
        try {
            const { nickname, password, age, gender, email, weight, height } = clientData
            const responseId: QueryResult = await this.client.query(INSERT_CLIENT_QUERY,
                [nickname, password])
            await this.client.query(INSERT_CLIENT_DATA_QUERY,
                [responseId.rows[0].id, age, gender, email, weight, height])
        } catch (e) {
            GENERAL_ERROR_HANDLER(e, this.res);
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
