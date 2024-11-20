import { Context } from "telegraf";
import { PartialWorkout } from "../../../model/workout";
import { PoolClient } from "pg";

export class ExerciseQueryDelete {
  static async ExerciseDelete(ctx: Context, workoutData: PartialWorkout, client: PoolClient): Promise<void> {
    const { name, day, week } = workoutData
    await client.query(`DELETE FROM workout WHERE name = $1 AND day = $2 AND week = $3 AND user_id = $4`,
      [name, day, week, ctx.from!.id])
  }
}
