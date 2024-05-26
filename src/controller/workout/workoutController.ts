import { pool } from "../../database/database";
import { GENERAL_ERROR_HANDLER } from "../../errors";
import { Response, Request } from "express";
import { WorkoutManager } from "./classes/workoutManager";

export const insertWorkout = async ({ params, body }: Request, res: Response,): Promise<void> => {
  let client;
  try {
    const { id } = params;
    client = await pool.connect();
    await new WorkoutManager(client, res).insertWorkout(id, body);
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res);
    console.error(`Error controller "insertWorkout": `, e);
  } finally {
    client && client.release();
  }
};

export const workoutData = async ({ params, body }: Request, res: Response) => {
  let client;
  try {
    const { id } = params;
    client = await pool.connect();
    await new WorkoutManager(client, res).workoutData(id, body);
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res);
    console.error(`Error controller "workoutData": `, e);
  } finally {
    client && client.release();
  }
};

export const deleteWorkoutData = async ({ params, body }: Request, res: Response,) => {
  let client;
  try {
    client = await pool.connect();
    const { id } = params;
    await new WorkoutManager(client, res).deleteWorkout(id, body);
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res);
    console.error(`Error "deleteWorkoutData": `, e);
  } finally {
    client && client.release();
  }
};

export const UpdateWorkoutData = async ({ params, body }: Request, res: Response,) => {
  let client;
  try {
    client = await pool.connect();
    const { id } = params;
    await new WorkoutManager(client, res).UpdateWorkout(id, body);
  } catch (e) {
    GENERAL_ERROR_HANDLER(e, res);
    console.error(`Erorr controller "UpdateWorkoutData": `, e);
  } finally {
    client && client.release();
  }
};
