import { PoolClient, QueryResult } from "pg";
import { Response } from "express";
import { ClientWorkout } from "../../../model/interface/workout";
import { GENERAL_ERROR_HANDLER, withTimeout } from "../../../errors";
import { insertWorkoutQuery, getWorkoutDataQuery, getSingleWorkoutDataQuery, updateWorkoutData, deleteWorkoutDataQuery } from "../../../queries/workoutQueries";
import { ResponseWorkout } from "./responseManager";
import { RequestExt } from "../../../middlewares/jsonWebToken/enCryptHelper";
import { ResponseClient } from "../../client/classes/responseManager";

export class WorkoutManager {
  constructor(private client: PoolClient, private req: RequestExt, private res: Response) { }
  public async insertWorkout(clientWorkout: ClientWorkout): Promise<void | Response<any>> {
    const user = this.req.user
    try {
      if (!user) return ResponseClient.clientNotFound(this.res)
      const response = await withTimeout(getSingleWorkoutDataQuery(this.client, user.id, clientWorkout))
      if (!response.rowCount) {
        await withTimeout(insertWorkoutQuery(this.client, user.id, clientWorkout))
        return ResponseWorkout.workoutInsert(this.res)
      } return ResponseWorkout.workoutAlreadyExists(this.res)
    } catch (e) {
      if (e instanceof Error && e.message === `Request timed out`) {
        return this.res.status(504).json({ error: `Request timed out` });
      }
      return GENERAL_ERROR_HANDLER(e, this.res);
    }
  }
  public async workoutData(clientWorkout: ClientWorkout): Promise<void | Response<any>> {
    const user = this.req.user
    try {
      if (!user) return ResponseClient.clientNotFound(this.res)
      const response: QueryResult = await withTimeout(getWorkoutDataQuery(this.client, user.id, clientWorkout))
      if (!response.rowCount) return ResponseWorkout.workoutDataNotFound(this.res)
      return ResponseWorkout.workoutData(this.res, response.rows)
    } catch (e) {
      if (e instanceof Error && e.message === `Request timed out`) {
        return this.res.status(504).json({ error: `Request timed out` });
      }
      return GENERAL_ERROR_HANDLER(e, this.res);
    }
  }
  public async UpdateWorkout(clientWorkout: ClientWorkout): Promise<void | Response<any>> {
    const user = this.req.user
    try {
      if (!user) return ResponseClient.clientNotFound(this.res)
      const { series, reps, kg } = clientWorkout
      const response: QueryResult = await withTimeout(getSingleWorkoutDataQuery(this.client, user.id, clientWorkout))
      const data: Partial<ClientWorkout> = {
        series: series ?? response.rows[0].series,
        reps: reps ?? response.rows[0].reps,
        kg: kg ?? response.rows[0].kg
      }
      await withTimeout(updateWorkoutData(this.client, user.id, data))
      return ResponseWorkout.workoutUpdate(this.res)
    } catch (e) {
      if (e instanceof Error && e.message === `Request timed out`) {
        return this.res.status(504).json({ error: `Request timed out` });
      }
      return GENERAL_ERROR_HANDLER(e, this.res)
    }
  }
  public async deleteWorkout(clientWorkout: ClientWorkout): Promise<void | Response<any>> {
    const user = this.req.user
    try {
      if (!user) return ResponseClient.clientNotFound(this.res)
      await withTimeout(deleteWorkoutDataQuery(this.client, user.id, clientWorkout))
      return ResponseWorkout.workoutDelete(this.res)
    } catch (e) {
      if (e instanceof Error && e.message === `Request timed out`) {
        return this.res.status(504).json({ error: `Request timed out` });
      }
      return GENERAL_ERROR_HANDLER(e, this.res)
    }
  }
}

