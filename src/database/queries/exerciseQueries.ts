import { Context } from "telegraf";
import {
  Exercise,
  getUserExercise,
  getUserSelectedExercisesId,
} from "../../userState";
import { PoolClient } from "pg";
import { onSession, onTransaction } from "../dataAccessLayer";
import { validateMonths } from "../../validators/allowedValues";

export class WorkoutQueryInsert {
  static async insertExerciseByUserId(userId: number): Promise<void> {
    const { day, name, reps, weight } = getUserExercise(userId);
    await onTransaction(async (clientTransaction) => {
      await clientTransaction.query(
        `INSERT into workout (day, name, reps, weight, user_id) values ($1, $2, $3, $4, $5)`,
        [day, name, reps, weight, userId],
      );
    });
  }
}

export class WorkoutQueryDelete {
  static async deleteExercise(ctx: Context): Promise<void> {
    const { name, day, week } = getUserExercise(ctx.from!.id);
    await onTransaction(async (clientTransaction) => {
      await clientTransaction.query(
        `DELETE FROM workout WHERE name = $1 AND day = $2 AND week = $3 AND 
user_id = $4`,
        [name, day, week, ctx.from!.id],
      );
    });
  }
  static async deleteSelectedExercises(ctx: Context): Promise<Exercise[]> {
    const { exercisesId } = getUserSelectedExercisesId(ctx.from!.id);
    console.log(getUserSelectedExercisesId(ctx.from!.id));
    const response = await onSession(async (clientTransaction) => {
      const response = await clientTransaction.query(
        `DELETE FROM workout 
          WHERE id = ANY($1) AND user_id = $2 
            RETURNING id, date_part('month', date) as month, name, reps,
weight, week`,
        [exercisesId, ctx.from!.id],
      );
      return response;
    });
    return response.rows;
  }
}

export class WorkoutQueryFetcher {
  static async getExercisesByMonthNameAndUserId(
    ctx: Context,
    monthNumber: number,
  ): Promise<Exercise[]> {
    const { name } = getUserExercise(ctx.from!.id);
    const exercises = await onSession(async (clientTransaction) => {
      return await clientTransaction.query(
        `SELECT day, name, reps, weight 
          FROM workout
            WHERE date_part('month', date) = $1 
              AND name = $2
                AND user_id = $3 ORDER by Date`,
        [monthNumber, name, ctx.from!.id],
      );
    });
    return exercises.rows;
  }
  static async getExercisesFromLastWeekByUserId(
    userId: number,
  ): Promise<Exercise[]> {
    const exercises = await onSession(async (clientTransaction) => {
      return await clientTransaction.query(
        `SELECT day, name, reps, weight 
          FROM workout
            WHERE user_id = $1
              AND date >= current_date - interval '14 days' 
                AND date < current_date - interval '7 days'`,
        [userId],
      );
    });
    return exercises.rows;
  }
  static async getExerciseByUserIdAndDay(
    userId: number,
    day: string,
  ): Promise<Exercise[]> {
    const response = await onSession(async (clientTransaction) => {
      return await clientTransaction.query(
        `SELECT day, name, reps, weight, week FROM workout
            WHERE user_id = $1 AND day = $2`,
        [userId, day],
      );
    });
    return response.rows;
  }
  static async getExerciseByUserId(userId: number): Promise<Exercise[]> {
    const response = await onSession(async (clientTransaction) => {
      return await clientTransaction.query(
        `SELECT id, day, name, reps, weight, week, date FROM workout 
            WHERE user_id = $1 ORDER BY  Date`,
        [userId],
      );
    });
    return response.rows;
  }
  static async getExerciseByMonthDayWeekAndUserId(
    userId: number,
  ): Promise<Exercise[]> {
    const data = getUserExercise(userId);
    const monthNumber: number =
      validateMonths.indexOf(data.month!.toLowerCase()) + 1;
    const response = await onSession(async (clientTransaction) => {
      return clientTransaction.query(
        `SELECT id, 
            date_part('year', date) as year,
            date_part('month', date) as month,
              day, name, reps, weight, week
                FROM workout 
                  WHERE EXTRACT(MONTH from date) = $1 AND day = $2 AND week = $3 AND user_id = $4`,
        [monthNumber, data.day, data.week, userId],
      );
    });
    return response.rows;
  }
  static async getExerciseByMonthDayAndUserId(
    userId: number,
    day: string,
    month: string,
  ): Promise<Exercise[]> {
    let monthNumber: number = validateMonths.indexOf(month.toLowerCase()) + 1;
    const response = await onSession(async (clientTransaction) => {
      return await clientTransaction.query(
        `SELECT id, day, name, reps, weight, week, date 
          FROM workout
            WHERE EXTRACT(MONTH FROM date) = $1 AND day = $2 AND user_id = $3
              ORDER by Date`,
        [monthNumber, day, userId],
      );
    });
    return response.rows;
  }
  static async getExerciseByMonthAndUserId(
    userId: number,
    month: string,
  ): Promise<Exercise[]> {
    let monthNumber: number = validateMonths.indexOf(month.toLowerCase()) + 1;
    const response = await onSession(async (clientTransaction) => {
      return await clientTransaction.query(
        `SELECT day, name, reps, weight, week, date 
          FROM workout
            WHERE EXTRACT(MONTH FROM date) = $1 AND user_id = $2`,
        [monthNumber, userId],
      );
    });
    return response.rows;
  }
}

export const workoutUpdateQuery = async (
  ctx: Context,
  workoutData: Exercise,
  client: PoolClient,
) => {
  client.query(
    `UPDATE workout SET  reps = $1, weight = $2 WHERE id = $3 AND day = $4 AND name = $5`,
    [
      workoutData.reps,
      workoutData.weight,
      ctx.from!.id,
      workoutData.day,
      workoutData.name,
    ],
  );
};
