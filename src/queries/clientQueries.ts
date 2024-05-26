import { PoolClient, QueryResult } from "pg"
import { ClientLogin, ClientData } from "../model/interface/client"
import { encrypt } from "../middlewares/jsonWebToken/enCryptHelper"

export const INSERT_CLIENT_QUERY = `
INSERT INTO client (nickname, password) VALUES ($1, $2) RETURNING id`

export const INSERT_CLIENT_DATA_QUERY = `
INSERT INTO client_data (id, age, gender, email, weight, height) VALUES ($1, $2, $3, $4, $5, $6)`

export const GET_CLIENT_DATA = `
SELECT * FROM client_data WHERE id = $1`

export const UPDATE_CLIENT_DATA = `
UPDATE client_data SET age = $1, gender = $2, email = $3, weight = $4, height = $5 WHERE id = $6`

export const DELETE_CLIENT_DATA = `
DELETE FROM client_data WHERE id = $1`

export const DELETE_CLIENT = `
DELETE FROM client WHERE id = $1`

export const DELETE_CLIENT_RECORDS = `
DELETE FROM workout WHERE id = $1`

export const GET_CLIENT_NICKNAME = `
SELECT * FROM client WHERE nickname = $1`


export const SingUpClientQuery = async (client: PoolClient, clientData: ClientData): Promise<void> => {
  const passwordHash = await encrypt(clientData.password)
  const id = await insertClientQuery(client, clientData, passwordHash)
  await insertClientDataQuery(client, id, clientData)
}

export const insertClientQuery = async (client: PoolClient, clientData: ClientLogin, password: string): Promise<string> => {
  const { nickname } = clientData
  const response: QueryResult = await client.query(`
  INSERT INTO client (nickname, password) VALUES ($1, $2) RETURNING id`, [nickname, password])
  return response.rows[0].id
}

export const insertClientDataQuery = async (client: PoolClient, id: string, clientData: ClientData): Promise<void> => {
  const { age, gender, email, weight, height } = clientData
  await client.query(` INSERT INTO client_data (id, age, gender, email, weight, height) VALUES ($1, $2, $3, $4, $5, $6)`
    , [id, age, gender, email, weight, height])
}

export const getClientData = async (client: PoolClient, id: string) => {
  const response: QueryResult = await client.query(
    `SELECT * FROM client_data WHERE id = $1`,
    [id])
  return response
}

export const updateClientData = async (client: PoolClient, id: any, clientData: any) => {
  const { age, gender, email, weight, height } = clientData
  await client.query(`
  UPDATE client_data SET age = $1, gender = $2, email = $3, weight = $4, height = $5 WHERE id = $6`,
    [age, gender, email, weight, height, id])
}

export const deleteClientRecords = async (client: PoolClient, id: any) => {
  Promise.all([
    await client.query(`DELETE FROM client WHERE id = $1`, [id]),
    await client.query(`DELETE FROM client_data WHERE id = $1`, [id]),
    await client.query(`DELETE FROM workout WHERE id = $1`, [id])
  ])
}

export const verifyNickname = async (client: PoolClient, clientData: ClientLogin) => {
  const { nickname } = clientData
  const response: QueryResult = await client.query(`
  SELECT * FROM client WHERE nickname = $1`, [nickname])
  return response
}

