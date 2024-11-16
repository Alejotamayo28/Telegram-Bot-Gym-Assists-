import { Context } from "telegraf";
import { onSession } from "../../../database/dataAccessLayer";
import { Exercise, PartialWorkout } from "../../../model/workout";

export class ExerciseQueryFetcher {
  static async ExerciseByInterval(ctx: Context, interval: number): Promise<Exercise[]> {
    const exercises = await onSession(async (clientTransaction) => {
      return await clientTransaction.query(
        `SELECT nombre, reps, kg FROM ejercicios
            WHERE usuario_id = $1
            AND fecha >= current_date - interval '${interval} days'`,
        [ctx.from!.id])
    })
    return exercises.rows
  }
  static async ExerciseIntervalFirtsWeek(ctx: Context): Promise<Exercise[]> {
    const response = await onSession(async (clientTransaction) => {
      return await clientTransaction.query(
        `SELECT day, name, reps, kg FROM workout
             WHERE user_id = $1 AND date >= current_date - interval '7 days'`,
        [ctx.from!.id]
      );
    });
    return response.rows
  }
  static async ExeriseIntervalSecondWeek(ctx: Context): Promise<Exercise[]> {
    const response = await onSession(async (clientTransaction) => {
      return await clientTransaction.query(`SELECT day, name, reps, kg FROM workout
            WHERE user_id = $1 AND date >= current_date - interval '14 days'
            AND date < current_date - interval '7 days'`,
        [ctx.from!.id]
      );
    });
    return response.rows
  }
  static async ExeriseIntervalThirdWeek(ctx: Context): Promise<Exercise[]> {
    const response = await onSession(async (clientTransaction) => {
      return await clientTransaction.query(
        `SELECT day, name, reps, kg  FROM workout 
            WHERE usuario_id = $1 AND date >= current_date - interval '21 days'
            AND date < current_date - interval '14 days'`,
        [ctx.from!.id]
      );
    });
    return response.rows
  }
  static async ExerciseByIdAndDay(userId: number, day: string): Promise<Exercise[]> {
    const response = await onSession(async (clientTransaction) => {
      return await clientTransaction.query(
        `SELECT day, name, reps, kg FROM workout
            WHERE user_id = $1 AND day = $2`,
        [userId, day]
      );
    });
    return response.rows
  }
  static async ExerciseById(userId: number): Promise<Exercise[]> {
    const response = await onSession(async (clientTransaction) => {
      return await clientTransaction.query(
        `SELECT day, name, reps, kg FROM workout 
            WHERE id = $1 ORDER BY  Date`, [userId])
    })
    return response.rows
  }
  static async ExerciseByNameRepsAndId(userId: number, workoutData: PartialWorkout) {
    const { name, day } = workoutData
    const response = await onSession(async (clientTransaction) => {
      return await clientTransaction.query(
        `SELECT name FORM workout WHERE name = $1 AND day = $2 AND user_id = $3`,
        [name, day, userId])
    })
    return response.rows
  }
}
