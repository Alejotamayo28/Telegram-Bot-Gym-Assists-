import { pool } from "../../database/database";
import { GENERAL_ERROR_HANDLER } from "../../errors";
import { Response } from "express";
import { WorkoutManager } from "./classes/workoutManager";
import { RequestExt } from "../../middlewares/jsonWebToken/enCryptHelper";

export const insertWorkout = async (req: RequestExt, res: Response,): Promise<void | Response<any>> => {
  let client;
  try {
    client = await pool.connect();
    await new WorkoutManager(client, req, res).insertWorkout(req.body);
  } catch (e) {
    return GENERAL_ERROR_HANDLER(e, res);
  } finally {
    client && client.release();
  }
};

export const workoutData = async (req: RequestExt, res: Response): Promise<void | Response<any>> => {
  let client;
  try {
    client = await pool.connect();
    await new WorkoutManager(client, req, res).workoutData(req.body);
  } catch (e) {
    return GENERAL_ERROR_HANDLER(e, res);
  } finally {
    client && client.release();
  }
};

export const deleteWorkoutData = async (req: RequestExt, res: Response): Promise<void | Response<any>> => {
  let client;
  try {
    client = await pool.connect();
    await new WorkoutManager(client, req, res).deleteWorkout(req.body);
  } catch (e) {
    return GENERAL_ERROR_HANDLER(e, res);
  } finally {
    client && client.release();
  }
};

export const UpdateWorkoutData = async (req: RequestExt, res: Response): Promise<void | Response<any>> => {
  let client;
  try {
    client = await pool.connect();
    await new WorkoutManager(client, req, res).UpdateWorkout(req.body);
  } catch (e) {
    return GENERAL_ERROR_HANDLER(e, res);
  } finally {
    client && client.release();
  }
};
