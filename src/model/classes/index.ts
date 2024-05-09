import { PoolClient, QueryResult } from 'pg';
import { Response } from 'express';
import { GENERAL_ERROR_HANDLER } from '../../errors';
import { Helper } from './helpers';

interface ClientData {
    nickname: string;
    password: string;
    age: number;
    gender: string;
    email: string;
    weight: number;
    height: number;
}

interface ClientUpdateData {
    age?: number;
    gender?: string;
    email?: string;
    weight?: number;
    height?: number;
}

interface ClientResponse extends QueryResult {
    rows: any[];
}

export class ClientManager {
    static async insertClient(client: PoolClient, res: Response, clientData: ClientData) {
        try {
            const { nickname, password, age, gender, email, weight, height } = clientData;
            const clientInsertResult = await client.query(`INSERT INTO client (nickname, password) VALUES ($1, $2) RETURNING id`, [nickname, password]);
            const clientId = clientInsertResult.rows[0].id;
            await client.query(`INSERT INTO client_data (id, age, gender, email, weight, height) VALUES ($1, $2, $3, $4, $5, $6)`, [clientId, age, gender, email, weight, height]);
        } catch (e) {
            GENERAL_ERROR_HANDLER(e, res);
        }
    }

    static async clientData(client: PoolClient, res: Response, id: string): Promise<any> {
        try {
            const response = await client.query(`SELECT * FROM client_data where id = $1`, [id]);
            return response;
        } catch (e) {
            GENERAL_ERROR_HANDLER(e, res);
        }
    }

    static async clientUpdate(client: PoolClient, id: string, clientData: ClientUpdateData): Promise<void> {
        const { age, gender, email, weight, height } = clientData;
        const response = await client.query(`SELECT * FROM client_data where id = $1`, [id]);
        const data = {
            age: age !== undefined ? age : response.rows[0].age,
            gender: gender !== undefined ? gender : response.rows[0].gender,
            email: email !== undefined ? email : response.rows[0].email,
            weight: weight !== undefined ? weight : response.rows[0].weight,
            height: height !== undefined ? height : response.rows[0].height
        };
        await client.query(`UPDATE client_data SET age = $1, gender = $2, email = $3, weight = $4, height = $5 WHERE id = $6`, [data.age, data.gender, data.email, data.weight, data.height, id]);
    }
}

export class WorkoutManager extends Helper {
    static async insertWorkout(client: PoolClient, res: Response, id: string, clientWorkout: any): Promise<void> {
        try {
            const { day, name, series, reps, kg } = clientWorkout;
            await client.query(`INSERT INTO workout (id,day,name,series,reps,kg) VALUES ($1,$2,$3,$4,$5,$6)`, [id, day, name, series, reps, kg]);
        } catch (e) {
            GENERAL_ERROR_HANDLER(e, res);
        }
    }

    static async workoutData(client: PoolClient, res: Response, id: string, clientWorkout: any) {
        try {
            const { day } = clientWorkout;
            const response = await client.query(`SELECT * FROM workout WHERE id = $1 and day = $2 `, [id, day]);
            return response;
        } catch (e) {
            GENERAL_ERROR_HANDLER(e, res);

        }
    }
}
