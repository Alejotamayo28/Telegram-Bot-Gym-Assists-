import { Context } from "telegraf";
import { PartialWorkout } from "../../../model/workout";
import { PoolClient } from "pg";

export const workoutUpdateQuery = async (ctx: Context, workoutData: PartialWorkout, client: PoolClient) => {
  client.query(
    `UPDATE workout SET  reps = $1, kg = $2 WHERE id = $3 AND day = $4 AND name = $5`,
    [workoutData.reps, workoutData.kg, ctx.from!.id, workoutData.day, workoutData.name])
}
