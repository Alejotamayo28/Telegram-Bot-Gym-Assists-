import { PoolClient } from "pg"
import { pool } from "./database"

const newSession = async (): Promise<PoolClient> => {
  return pool.connect()
}
const closeSession = async (client: PoolClient): Promise<void> => {
  return client.release(true)
}
export const onTransaction = async <T>(callback: (client: PoolClient) => Promise<T>): Promise<T> => {
  const client = await newSession()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    await closeSession(client)
  }
}
export const onSession = async <T>(callback: (client: PoolClient) => Promise<T>): Promise<T> => {
  const client = await newSession()
  try {
    const result = await callback(client)
    return result
  } catch (error) {
    console.error("OPERATION FAILED", {}, error)
    throw error
  } finally {
    await closeSession(client)
  }
}

