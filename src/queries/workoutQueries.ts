import { PoolClient, QueryResult } from "pg"
import { ClientWorkout } from "../model/interface/workout"

export const insertWorkoutQuery = async (client: PoolClient, id: any, clientWorkout: ClientWorkout): Promise<void> => {
  const { day, name, series, reps, kg } = clientWorkout
  await client.query(`
  INSERT INTO workout (id, day, name, series, reps, kg) VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, day, name, series, reps, kg])
}

export const getWorkoutDataQuery = async (client: PoolClient, id: any, clientWorkout: ClientWorkout): Promise<QueryResult> => {
  const { day } = clientWorkout
  const response: QueryResult = await client.query(`
  SELECT * FROM workout WHERE id = $1 AND day = $2`,
    [id, day])
  return response
}

export const getSingleWorkoutDataQuery = async (client: PoolClient, id: any, clientWorkout: ClientWorkout): Promise<QueryResult> => {
  const { day, name } = clientWorkout
  const response: QueryResult = await client.query(`
  SELECT * FROM workout WHERE id = $1 AND day = $2 AND name = $3`,
    [id, day, name])
  return response
}

export const updateWorkoutData = async (client: PoolClient, id: any, clientWorkout: any): Promise<void> => {
  const { day, name, series, reps, kg } = clientWorkout
  await client.query(`
  UPDATE workout SET day = $1, name = $2, series = $3, reps = $4, kg = $5 WHERE id = $6`,
    [day, name, series, reps, kg, id])
}

export const deleteWorkoutDataQuery = async (client: PoolClient, id: any, clientWorkout: ClientWorkout): Promise<void> => {
  const { name, day } = clientWorkout
  await client.query(`
  DELETE FROM workout WHERE name = $1 AND day = $2 WHERE id = $3`,
    [name, day, id])
}


