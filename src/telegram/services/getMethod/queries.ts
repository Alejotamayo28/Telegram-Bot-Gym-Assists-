import { Context } from "telegraf";
import { onSession } from "../../../database/dataAccessLayer";
import { validateMonths } from "../../../validators/allowedValues";
import { Exercise, getUserExercise, userState } from "../../../userState";

export class ExerciseQueryFetcher {
  static async ExercisesByMonthNameAndId(ctx: Context, monthNumber: number): Promise<Exercise[]> {
    const { name } = getUserExercise(ctx.from!.id)
    const exercises = await onSession(async (clientTransaction) => {
      return await clientTransaction.query(
        `SELECT day, name, reps, weight 
          FROM workout
            WHERE date_part('month', date) = $1 
              AND name = $2
                AND user_id = $3 ORDER by Date`, [monthNumber, name, ctx.from!.id])
    })
    return exercises.rows
  }
  static async ExcerciseLastWeekById(ctx: Context): Promise<Exercise[]> {
    const exercises = await onSession(async (clientTransaction) => {
      return await clientTransaction.query(
        `SELECT day, name, reps, weight 
          FROM workout
            WHERE user_id = $1
              AND date >= current_date - interval '14 days' 
                AND date < current_date - interval '7 days'`,
        [ctx.from!.id])
    })
    return exercises.rows
  }
  static async ExerciseByInterval(ctx: Context, interval: number): Promise<Exercise[]> {
    const exercises = await onSession(async (clientTransaction) => {
      return await clientTransaction.query(
        `SELECT nombre, reps, weight FROM ejercicios
            WHERE usuario_id = $1
            AND fecha >= current_date - interval '${interval} days'`,
        [ctx.from!.id])
    })
    return exercises.rows
  }
  static async ExerciseIntervalFirtsWeek(ctx: Context): Promise<Exercise[]> {
    const response = await onSession(async (clientTransaction) => {
      return await clientTransaction.query(
        `SELECT day, name, reps, weight FROM workout
             WHERE user_id = $1 AND date >= current_date - interval '7 days'`,
        [ctx.from!.id]
      );
    });
    return response.rows
  }
  static async ExeriseIntervalSecondWeek(ctx: Context): Promise<Exercise[]> {
    const response = await onSession(async (clientTransaction) => {
      return await clientTransaction.query(`SELECT day, name, reps, weight FROM workout
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
        `SELECT day, name, reps, weight  FROM workout 
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
        `SELECT day, name, reps, weight, week FROM workout
            WHERE user_id = $1 AND day = $2`,
        [userId, day]
      );
    });
    return response.rows
  }
  static async ExerciseById(userId: number): Promise<Exercise[]> {
    const response = await onSession(async (clientTransaction) => {
      return await clientTransaction.query(
        `SELECT id, day, name, reps, weight, week, date FROM workout 
            WHERE user_id = $1 ORDER BY  Date`, [userId])
    })
    return response.rows
  }
  static async ExerciseByMonthDayWeekAndId(userId: number): Promise<Exercise[]> {
    const data = getUserExercise(userId)
    const monthNumber: number = validateMonths.indexOf(data.month!.toLowerCase()) + 1
    const response = await onSession(async (clientTransaction) => {
      return clientTransaction.query(
        `SELECT id, 
            date_part('year', date) as year,
            date_part('month', date) as month,
              day, name, reps, weight, week
                FROM workout 
                  WHERE EXTRACT(MONTH from date) = $1 AND day = $2 AND week = $3 AND user_id = $4`,
        [monthNumber, data.day, data.week, userId])
    })
    return response.rows
  }
  static async ExerciseByIdAndDayAndMonth(userId: number, day: string, month: string): Promise<Exercise[]> {
    let monthNumber: number = validateMonths.indexOf(month.toLowerCase()) + 1
    const response = await onSession(async (clientTransaction) => {
      return await clientTransaction.query(
        `SELECT id, day, name, reps, weight, week, date 
          FROM workout
            WHERE EXTRACT(MONTH FROM date) = $1 AND day = $2 AND user_id = $3
              ORDER by Date`,
        [monthNumber, day, userId])
    })
    return response.rows
  }
  static async ExerciseByIdAndMonth(userId: number, month: string): Promise<Exercise[]> {
    let monthNumber: number = validateMonths.indexOf(month.toLowerCase()) + 1
    const response = await onSession(async (clientTransaction) => {
      return await clientTransaction.query(
        `SELECT day, name, reps, weight, week, date 
          FROM workout
            WHERE EXTRACT(MONTH FROM date) = $1 AND user_id = $2`,
        [monthNumber, userId])
    })
    return response.rows
  }
}
