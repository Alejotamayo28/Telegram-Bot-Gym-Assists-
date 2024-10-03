import { Context } from "telegraf";
import { workoutOutput } from "../../../model/workout";
import { PoolClient } from "pg";

export const deleteWorkoutQuery = async (ctx: Context, workoutData: workoutOutput, client: PoolClient) => {
  await client.query(`DELETE FROM workout WHERE name = $1 AND day = $2 AND id = $3`,
    [workoutData.name, workoutData.day, ctx.from!.id])
}
