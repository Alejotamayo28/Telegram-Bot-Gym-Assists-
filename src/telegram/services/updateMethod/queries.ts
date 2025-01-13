import { Context } from "telegraf";
import { PartialWorkout } from "../../../model/workout";
import { PoolClient } from "pg";
import { onSession } from "../../../database/dataAccessLayer";
import { Exercise } from "../../../userState";

export class ExerciseQueryUpdate {
  static async ExerciseUpdateQuery(ctx: Context): Promise<void> {
    const response = await onSession(async (clientTransaction) => {
      return await clientTransaction.query(
        `UPDATE workout 
          SET reps = $1, kg = $2 WHERE id = $3 AND day = $4 AND name = $5`, [])
    })
  }
}


export const workoutUpdateQuery = async (ctx: Context, workoutData: Exercise, client: PoolClient) => {
  client.query(
    `UPDATE workout SET  reps = $1, kg = $2 WHERE id = $3 AND day = $4 AND name = $5`,
    [workoutData.reps, workoutData.weight, ctx.from!.id, workoutData.day, workoutData.name])
}
