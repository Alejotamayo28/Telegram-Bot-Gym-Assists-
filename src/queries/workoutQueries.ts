import { PoolClient, QueryResult, QueryResultRow } from "pg"
import { ClientWorkout } from "../model/interface/workout"
import { ClientLogin } from "../model/interface/client"

export const insertWorkoutQuery = async (client: PoolClient, id: any, clientWorkout: ClientWorkout): Promise<void> => {
  const { day, name, series, reps, kg } = clientWorkout
  await client.query(` INSERT INTO workout (id, day, name, series, reps, kg) VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, day, name, series, reps, kg])
  client.release()
}


export const getWorkoutDataQuery = async (client: PoolClient, id: any, clientWorkout: ClientWorkout): Promise<QueryResult> => {
  const { day } = clientWorkout
  const response: QueryResult = await client.query(`
  SELECT day, name, series, reps, kg FROM workout WHERE id = $1 AND day = $2`,
    [id, day])
  client.release()
  return response
}

export const getSingleWorkoutDataQuery = async (client: PoolClient, id: any, clientWorkout: ClientWorkout): Promise<QueryResult> => {
  const { day, name } = clientWorkout
  const response: QueryResult = await client.query(`
  SELECT * FROM workout WHERE id = $1 AND day = $2 AND name = $3`,
    [id, day, name])
  client.release()
  return response
}

export const getWorkoutAllDataQuery = async (client: PoolClient, id: any) => {
  const response: QueryResult = await client.query(`
  SELECT * FROM workout WHERE id = $1`, [id])
  client.release()
  return response
}

export const getWorkoutDataPerDay = async (client: PoolClient, id: any, day: string) => {
  const response: QueryResult = await client.query(`
SELECT * FROM workout WHERE id = $1 AND day = $2`,
    [id, day])
  return response
}


export const updateWorkoutData = async (client: PoolClient, id: any, clientWorkout: any): Promise<void> => {
  const { day, name, series, reps, kg } = clientWorkout
  await client.query(`
  UPDATE workout SET series = $1, reps = $2, kg = $3 WHERE id = $4 and day = $5 and name = $6`,
    [series, reps, kg, id, day, name])
  client.release()
}

export const deleteWorkoutDataQuery = async (client: PoolClient, id: any, clientWorkout: ClientWorkout): Promise<void> => {
  const { name, day } = clientWorkout
  await client.query(`
  DELETE FROM workout WHERE name = $1 AND day = $2 AND id = $3`,
    [name, day, id])
}











