import { PoolClient } from "pg";
import { Context } from "telegraf";
import { Exercise } from "../../../userState";

export class ExerciseQueryPost {
  static async ExercisePost(workoutData: Exercise, ctx: Context, client: PoolClient): Promise<void> {
    const date = new Date
    const weekDay = (date: Date): number => {
      const day = date.getDate();
      if (day >= 1 && day <= 7) return 1
      if (day >= 8 && day <= 14) return 2
      if (day >= 15 && day <= 21) return 3
      return 4
    }
    await client.query(`INSERT INTO workout(user_id, date, day, name, reps, weight, week) VALUES($1, $2, $3, $4, $5, $6, $7)`,
      [ctx.from!.id, date, workoutData.day, workoutData.name, workoutData.reps, workoutData.weight, weekDay(date)])
  }
  static async ExercisePostTesting(workoutData: Exercise, ctx: Context, client: PoolClient): Promise<void> {
    await client.query(
      `INSERT INTO ejercicios (usuario_id, dia, fecha, nombre, reps, weight, semana)
    VALUES ($1, $2, CURRENT_DATE, $3, $4, $5, 
    EXTRACT(WEEK FROM CURRENT_DATE) - EXTRACT(WEEK FROM CURRENT_DATE - interval '21 days'))`,
      [ctx.from!.id, workoutData.day, workoutData.name, workoutData.reps, workoutData.weight])
  }
}

