import { Context } from "telegraf";
import { PoolClient } from "pg";
import { Exercise } from "../../../userState";

export const workoutUpdateQuery = async (ctx: Context, workoutData: Exercise, client: PoolClient) => {
  client.query(
    `UPDATE workout SET  reps = $1, weight = $2 WHERE id = $3 AND day = $4 AND name = $5`,
    [workoutData.reps, workoutData.weight, ctx.from!.id, workoutData.day, workoutData.name])
}
