import { PoolClient } from 'pg';

export const insertClientWithId = async (
    client: PoolClient,
    nickname: string,
    password: string,
    age: number,
    gender: string,
    email: string,
    weight: number,
    height: number
): Promise<void> => {
    const response = await client.query(
        `INSERT INTO client (nickname, password) VALUES ($1, $2) RETURNING id`,
        [nickname, password]
    );
    await client.query(
        `INSERT INTO client_data (id, age, gender, email, weight, height) VALUES ($1, $2, $3, $4, $5, $6)`,
        [response.rows[0].id, age, gender, email, weight, height]
    );
};
