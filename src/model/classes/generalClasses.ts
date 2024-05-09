import { PoolClient, QueryResult } from 'pg';
import { Response } from 'express';
import { GENERAL_ERROR_HANDLER } from '../../errors';
import { ClientData } from '../interface/generalInterfaces';
import { ClientQueries } from './queriesClasses';

export class ClientManager {
    constructor(private client: PoolClient, private res: Response) { }
    public async insertClient(clientData: ClientData) {
        try {
            const responseId: QueryResult = await new ClientQueries(this.client, this.res).postClientQuery(clientData)
            await new ClientQueries(this.client, this.res).postClientDataQuery(responseId, clientData)
        } catch (e) {
            GENERAL_ERROR_HANDLER(e, this.res);
        }
    }
    public async clientData(id: string): Promise<any> {
        try {
            const response = await new ClientQueries(this.client, this.res).getClientData(id)
            return response
        } catch (e) {
            GENERAL_ERROR_HANDLER(e, this.res)
            console.error(e)
        }
    }
    public async clientUpdate(id: string, clientData: ClientData): Promise<void> {
        try {
            const { nickname, password, age, gender, email, weight, height } = clientData;
            const response = await new ClientQueries(this.client, this.res).getClientData(id)
            const data = {
                nickname: nickname ?? response!.rows[0].nickname,
                password: password ?? response!.rows[0].password,
                age: age ?? response!.rows[0].age,
                gender: gender ?? response!.rows[0].gender,
                email: email ?? response!.rows[0].email,
                weight: weight ?? response!.rows[0].weight,
                height: height ?? response!.rows[0].height
            };
            await new ClientQueries(this.client, this.res).updateClient(id, data)
        } catch (e) {
            GENERAL_ERROR_HANDLER(e, this.res)
            console.error(e)
        }
    }
}

export class WorkoutManager {
    constructor(private client: PoolClient, private res: Response) { }
    public async insertWorkout(id: string, clientWorkout: any): Promise<void> {
        try {
            const { day, name, series, reps, kg } = clientWorkout;
            await this.client.query(`INSERT INTO workout (id,day,name,series,reps,kg) VALUES ($1,$2,$3,$4,$5,$6)`, [id, day, name, series, reps, kg]);
        } catch (e) {
            GENERAL_ERROR_HANDLER(e, this.res);
            console.error(e)
        }
    }

    public async workoutData(id: string, clientWorkout: any) {
        try {
            const { day } = clientWorkout;
            const response = await this.client.query(`SELECT * FROM workout WHERE id = $1 and day = $2 `, [id, day]);
            return response;
        } catch (e) {
            GENERAL_ERROR_HANDLER(e, this.res);

        }
    }
    async verifyWorkout(id: string, clientWorkout: any) {
        try {
            const { day, name } = clientWorkout;
            const response = await this.client.query(`SELECT * FROM workout WHERE id = $1 AND DAY = $2 AND NAME = $3`, [id, day, name]);
            return response.rowCount;
        } catch (e) {
            GENERAL_ERROR_HANDLER(e, this.res);
            return 0;
        }
    }
}
