import { pool } from "../../database/database";
import { GENERAL_ERROR_HANDLER } from "../../errors";
import { Response} from "express";
import { WorkoutManager } from "./classes/workoutManager";
import { RequestExt } from "../../middlewares/jsonWebToken/enCryptHelper";

export const insertWorkout = async (req: RequestExt, res: Response,): Promise<void> => {
  let client;
  try {
    client = await pool.connect();
    await new WorkoutManager(client, req, res).insertWorkout(req.body);
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res);
    console.error(`Error controller "insertWorkout": `, e);
  } finally {
    client && client.release();
  }
};

export const workoutData = async (req: RequestExt, res: Response) => {
  let client;
  try {
    client = await pool.connect();
    await new WorkoutManager(client, req, res).workoutData(req.body);
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res);
    console.error(`Error controller "workoutData": `, e);
  } finally {
    client && client.release();
  }
};

export const deleteWorkoutData = async (req: RequestExt, res: Response,) => {
  let client;
  try {
    client = await pool.connect();
    await new WorkoutManager(client, req, res).deleteWorkout(req.body);
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res);
    console.error(`Error controller "deleteWorkoutData": `, e);
  } finally {
    client && client.release();
  }
};

export const UpdateWorkoutData = async (req: RequestExt, res: Response,) => {
  let client;
  try {
    client = await pool.connect();
    await new WorkoutManager(client, req, res).UpdateWorkout(req.body);
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res);
    console.error(`Erorr controller "UpdateWorkoutData": `, e);
  } finally {
    client && client.release();
  }
};
