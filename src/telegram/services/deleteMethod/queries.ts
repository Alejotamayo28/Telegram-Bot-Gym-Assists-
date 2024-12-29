import { Context } from "telegraf";
import { Exercise, PartialWorkout } from "../../../model/workout";
import { PoolClient } from "pg";
import { UpdateUserStateOptions, userState } from "../../../userState";
import { onSession } from "../../../database/dataAccessLayer";

export class ExerciseQueryDelete {
  static async ExerciseDelete(ctx: Context, workoutData: PartialWorkout, client: PoolClient): Promise<void> {
    const { name, day, week } = workoutData
    await client.query(`DELETE FROM workout WHERE name = $1 AND day = $2 AND week = $3 AND user_id = $4`,
      [name, day, week, ctx.from!.id])
  }
  static async DeleteSelectedExercises(ctx: Context): Promise<Exercise[]> {
    const { exercisesId }: UpdateUserStateOptions = userState[ctx.from!.id]
    const response = await onSession(async (clientTransaction) => {
      const response = await clientTransaction.query(
        `DELETE FROM workout 
          WHERE id = ANY($1) AND user_id = $2 
            RETURNING id, date_part('month', date) as month, name, reps, kg, week`,
        [exercisesId, ctx.from!.id])
      return response
    })
    console.log(`Ejercicios a eliminar: `, response.rows)
    return response.rows
  }
}
