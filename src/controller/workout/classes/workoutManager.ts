import { PoolClient, QueryResult } from "pg";
import { Response } from "express";
import { ClientWorkout } from "../../../model/interface/workout";
import { GENERAL_ERROR_HANDLER } from "../../../errors";
import { insertWorkoutQuery, getWorkoutDataQuery, getSingleWorkoutDataQuery, updateWorkoutData, deleteWorkoutDataQuery } from "../../../queries/workoutQueries";
import { ResponseWorkout } from "./responseManager";

export class WorkoutManager {
  constructor(private client: PoolClient, private res: Response) { }
  public async insertWorkout(id: string, clientWorkout: ClientWorkout): Promise<void> {
    try {
      const response = await getSingleWorkoutDataQuery(this.client, id, clientWorkout)
      if (!response.rowCount) {
        await insertWorkoutQuery(this.client, id, clientWorkout)
        return ResponseWorkout.workoutInsert(this.res)
      } else return ResponseWorkout.workoutAlreadyExists(this.res)
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res);
      console.error(`Error inserting workout: `, e)
    }
  }
  public async workoutData(id: string, clientWorkout: ClientWorkout) {
    try {
      const response: QueryResult = await getWorkoutDataQuery(this.client, id, clientWorkout)
      if (!response.rowCount) return ResponseWorkout.workoutDataNotFound(this.res)
      return ResponseWorkout.workoutData(this.res, response.rows)
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res);
      console.error(`Error getting workout Data: `, e)
    }
  }
  public async UpdateWorkout(id: any, clientWorkout: ClientWorkout) {
    try {
      const { series, reps, kg } = clientWorkout
      const response: QueryResult = await getSingleWorkoutDataQuery(this.client, id, clientWorkout)
      type OmitTwo<T, K1 extends keyof T, K2 extends keyof T> = Omit<T, K1 | K2>
      const data: OmitTwo<ClientWorkout, 'day', 'name'> = {
        series: series ?? response.rows[0].series,
        reps: reps ?? response.rows[0].reps,
        kg: kg ?? response.rows[0].kg
      }
      await updateWorkoutData(this.client, id, data)
      return ResponseWorkout.workoutUpdate(this.res)
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res)
      console.error(`Error updating workout data: `, e)
    }
  }
  public async deleteWorkout(id: any, clientWorkout: ClientWorkout) {
    try {
      await deleteWorkoutDataQuery(this.client, id, clientWorkout)
      return ResponseWorkout.workoutDelete(this.res)
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res)
      console.error(`Error deleting workout data: `, e)
    }
  }
}
