import { PoolClient, QueryResult } from "pg";
import { Response } from "express";
import { ClientWorkout } from "../../../model/interface/workout";
import { GENERAL_ERROR_HANDLER } from "../../../errors";
import { INSERT_WORKOUT_QUERY, GET_WORKOUT_DATA, GET_SINGLE_WORKOUT, UPDATE_WORKOUT, DELETE_WORKOUT } from "../../../queries/workoutQueries";
import { ResponseWorkout } from "./responseManager";

export class WorkoutManager {
  constructor(private client: PoolClient, private res: Response) { }
  public async insertWorkout(id: string, clientWorkout: ClientWorkout): Promise<void> {
    try {
      const { day, name, series, reps, kg } = clientWorkout;
      await this.client.query(INSERT_WORKOUT_QUERY,
        [id, day, name, series, reps, kg]);
      return ResponseWorkout.workoutInsert(this.res)
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res);
      console.error(e)
    }
  }
  public async workoutData(id: string, clientWorkout: ClientWorkout) {
    try {
      const { day } = clientWorkout;
      const response: QueryResult = await this.client.query(GET_WORKOUT_DATA, [id, day]);
      if (!response.rowCount) return ResponseWorkout.workoutDataNotFound(this.res)
      return ResponseWorkout.workoutData(this.res, response.rows)
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res);
    }
  }
  public async verifyWorkout(id: string, clientWorkout: ClientWorkout) {
    try {
      const { day, name } = clientWorkout;
      const response: QueryResult = await this.client.query(GET_SINGLE_WORKOUT,
        [id, day, name]);
      return response.rowCount
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res);
      console.error(e)
    }
  }
  public async UpdateWorkout(id: any, clientWorkout: ClientWorkout) {
    try {
      const { day, name, series, reps, kg } = clientWorkout
      const response: QueryResult = await this.client.query(GET_WORKOUT_DATA,
        [id, day])
      const data = {
        day: day ?? response.rows[0].day,
        name: name ?? response.rows[0].name,
        series: series ?? response.rows[0].series,
        reps: reps ?? response.rows[0].reps,
        kg: kg ?? response.rows[0].kg
      }
      await this.client.query(UPDATE_WORKOUT,
        [data.day, data.name, data.series, data.reps, data.kg, id])
      return ResponseWorkout.workoutUpdate(this.res, id, day)
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res)
      console.error(e)
    }
  }
  public async deleteWorkout(id: any, clientWorkout: ClientWorkout) {
    try {
      const { day, name } = clientWorkout
      await this.client.query(DELETE_WORKOUT,
        [name, day, id])
      return ResponseWorkout.workoutDelete(this.res, day, name)
    } catch (e) {
      GENERAL_ERROR_HANDLER(e, this.res)
      console.error(e)
    }
  }
}
