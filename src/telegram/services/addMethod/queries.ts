import { PoolClient } from "pg";
import { workoutOutput } from "../../../model/workout";
import { Context } from "telegraf";

export const insertWorkoutQuery = async (workoutData: workoutOutput, ctx: Context, client: PoolClient) => {
  await client.query(`INSERT INTO workout(id, day, name, reps, kg) VALUES($1, $2, $3, $4, $5)`,
    [ctx.from!.id, workoutData.day, workoutData.name, workoutData.reps, workoutData.kg])
}
