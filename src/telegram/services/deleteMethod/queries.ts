import { Context } from "telegraf";
import { PartialWorkout } from "../../../model/workout";
import { PoolClient } from "pg";

export class ExerciseQueryDelete {
  static async ExerciseDelete(ctx: Context, workoutData: PartialWorkout, client: PoolClient): Promise<void> {
    const { name, day } = workoutData
    await client.query(`DELETE FROM workout WHERE name = $1 AND day = $2 AND user_id = $3`,
      [name, day, ctx.from!.id])
  }
}
