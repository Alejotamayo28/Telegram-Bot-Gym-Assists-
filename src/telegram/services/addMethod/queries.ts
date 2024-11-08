import { PoolClient } from "pg";
import { PartialWorkout } from "../../../model/workout";
import { Context } from "telegraf";

export class ExerciseQueryPost {
  static async ExercisePost(workoutData: PartialWorkout, ctx: Context, client: PoolClient): Promise<void> {
    await client.query(`INSERT INTO workout(id, day, name, reps, kg) VALUES($1, $2, $3, $4, $5)`,
      [ctx.from!.id, workoutData.day, workoutData.name, workoutData.reps, workoutData.kg])
  }
  static async ExercisePostTesting(workoutData: PartialWorkout, ctx: Context, client: PoolClient): Promise<void> {
    await client.query(
   `INSERT INTO ejercicios (usuario_id, dia, fecha, nombre, reps, kg, semana)
    VALUES ($1, $2, CURRENT_DATE, $3, $4, $5, 
    EXTRACT(WEEK FROM CURRENT_DATE) - EXTRACT(WEEK FROM CURRENT_DATE - interval '21 days'))`,
      [ctx.from!.id, workoutData.day, workoutData.name, workoutData.reps, workoutData.kg])
  }
}

