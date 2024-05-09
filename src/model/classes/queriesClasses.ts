import { PoolClient, Query, QueryArrayResult, QueryResult } from "pg";
import { ClientData } from "../interface/generalInterfaces";
import { GENERAL_ERROR_HANDLER } from "../../errors";
import { Response } from "express";


const INSERT_CLIENT_QUERY = `
INSERT INTO client (nickname, password) VALUES ($1, $2) RETURNING id`

const INSERT_CLIENT_DATA_QUERY = `
INSERT INTO client_data (id, age, gender, email, weight, height) VALUES ($1, $2, $3, $4, $5, $6)`

const GET_CLIENT_DATA = `
SELECT * FROM client_data WHERE id = $1`

const UPDATE_CLIENT_DATA = `
UPDATE client_data SET age = $1, gender = $2, email = $3, weight = $4, height = $5 WHERE id = $6`

export class ClientQueries {
    constructor(private client: PoolClient, private res: Response) { }
    public async postClientQuery(clientData: ClientData) {
        try {
            const { nickname, password } = clientData
            const response: QueryResult = await this.client.query(INSERT_CLIENT_QUERY,
                [nickname, password])
            return response.rows[0].id
        } catch (e) {
            GENERAL_ERROR_HANDLER(e, this.res)
            console.error(e)
        }
    }
    public async postClientDataQuery(id: any, clientData: ClientData) {
        try {
            const { age, gender, email, weight, height } = clientData
            await this.client.query(INSERT_CLIENT_DATA_QUERY,
                [id, age, gender, email, weight, height])

        } catch (e) {
            GENERAL_ERROR_HANDLER(e, this.res)
            console.error(e)
        }
    }
    public async getClientData(id: any) {
        try {
            const response: QueryResult = await this.client.query(GET_CLIENT_DATA, [id])
            return response
        } catch (e) {
            GENERAL_ERROR_HANDLER(e, this.res)
            console.error(e)
        }
    }
    public async updateClient(id: any, clientData: ClientData) {
        try {
            await this.client.query(UPDATE_CLIENT_DATA, [
                clientData.age, clientData.gender, clientData.email, clientData.weight, clientData.height, id
            ])
        } catch (e) {
            GENERAL_ERROR_HANDLER(e, this.res)
            console.error(e)
        }
    }
}