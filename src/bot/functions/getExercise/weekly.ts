import { QueryResult } from "pg";
import { Context } from "telegraf";
import { handleExerciseNotFound } from "../updateExercise";
import { pool } from "../../../database/database";
import { validateDays } from "..";

export const findWeeklyExercises = async (userId: number) => {
  const response: QueryResult = await pool.query(
    `SELECT day, name, reps, kg FROM workout WHERE id = $1 ORDER BY  name`, [userId])
  return response.rowCount ? response.rows : null
}

interface Ejercicio {
  name: string,
  day: string,
  reps: any,
  kg: number
}

export const mapWeeklyExercise = (data: Ejercicio[]) => {
  const groupedExercises: { [day: string]: Ejercicio[] } = {}
  data.forEach((exercise: Ejercicio) => {
    if (validateDays.includes(exercise.day)) {
      if (!groupedExercises[exercise.day]) {
        groupedExercises[exercise.day] = [];
      }
      groupedExercises[exercise.day].push(exercise);
    }
  });
  let result = "";
  validateDays.forEach((day) => {
    if (groupedExercises[day]) {
      result += `
*Dia:*\\ _${day}_\n`.toUpperCase();
      groupedExercises[day].forEach((exercise) => {
        result += `
_Nombre:_ ${exercise.name}
_Reps:_ ${exercise.reps}
_Peso:_ ${Math.trunc(exercise.kg)}\n`;
      });
    }
  });
  return result.trim()
}

export const handleGetWeeklyExercises = async (ctx: Context) => {
  const exercise = await findWeeklyExercises(ctx.from!.id)
  if (!exercise) {
    await handleExerciseNotFound(ctx)
    await ctx.deleteMessage()
    return
  }
  const formattedExercises = mapWeeklyExercise(exercise)
  await ctx.reply(formattedExercises, {
    parse_mode: 'MarkdownV2'
  })
}
