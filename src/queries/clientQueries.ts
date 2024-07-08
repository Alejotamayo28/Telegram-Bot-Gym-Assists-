import { PoolClient, QueryResult } from "pg"
import { ClientLogin, ClientData } from "../model/interface/client"
import { encrypt } from "../middlewares/jsonWebToken/enCryptHelper"
import { pool } from "../database/database"

export const SingUpClientQuery = async (client: PoolClient, clientData: ClientData): Promise<void> => {
  const passwordHash = await encrypt(clientData.password)
  const id = await insertClientQuery(client, clientData, passwordHash)
  await insertClientDataQuery(client, id, clientData)
  client.release()
}

export const insertClientQuery = async (client: PoolClient, clientData: ClientLogin, password: string) => {
  const { nickname } = clientData
  const response: QueryResult = await client.query(`
  INSERT INTO client (nickname, password) VALUES ($1, $2) RETURNING id`, [nickname, password])
  client.release()
  return response.rows[0].id
}

export const getClientData = async (client: PoolClient, id: any) => {
  const response: QueryResult = await client.query(
    `SELECT * FROM client_data WHERE client_id = $1`,
    [id])
  client.release()
  return response
}
export const insertClientDataQuery = async (client: PoolClient, id: string, clientData: ClientData): Promise<void> => {
  const { first_name, last_name, age, gender, email, weight, height } = clientData
  const date: Date = new Date()
  await client.query(`
  INSERT INTO client_data (client_id, first_name, last_name, age, gender, email, weight, height, created_at, updated_at) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [id, first_name, last_name, age, gender, email, weight, height, date, date])
  client.release()
}

export const updateClientData = async (client: PoolClient, id: any, clientData: any) => {
  const { first_name, last_name, age, gender, email, weight, height } = clientData
  const date: Date = new Date()
  await client.query(`
  UPDATE client_data SET first_name = $1, last_name = $2, age = $3, gender = $4, email = $5, weight = $6, height = $7,
  updated_at = $8 WHERE client_id = $9`,
    [first_name, last_name, age, gender, email, weight, height, date, id])
  client.release()
}

export const deleteClientRecords = async (client: PoolClient, id: any) => {
  Promise.all([
    await client.query(`DELETE FROM client WHERE id = $1`, [id]),
    await client.query(`DELETE FROM client_data WHERE id = $1`, [id]),
    await client.query(`DELETE FROM workout WHERE id = $1`, [id])
  ])
}

export const verifyNickname = async (client: PoolClient, nickname:string) => {
  const response: QueryResult = await client.query(`
  SELECT * FROM client WHERE nickname = $1`, [nickname])
  return response
}
export const verifyNicknameWhatsapp = async (nickname: string) => {
  const response: QueryResult = await pool.query(`
  SELECT * FROM client WHERE nickname = $1`, [nickname])
  return response
}



