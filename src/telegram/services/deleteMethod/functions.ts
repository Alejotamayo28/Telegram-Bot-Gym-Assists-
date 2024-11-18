import { Context } from "telegraf";
import { deleteUserMessage, userStageDeleteExercise, userStateUpdateDay } from "../../../userState";
import { EXERCISE_DELETE_NAME } from "./messages";

export const handleDeleteExerciseDay = async (ctx: Context, userMessage: string) => {
  try {
    userStateUpdateDay(ctx, userMessage, userStageDeleteExercise.DELETE_EXERCISE_NAME)
    await deleteUserMessage(ctx)
    await ctx.reply(EXERCISE_DELETE_NAME, {
      parse_mode: "Markdown",
    });
  } catch (error) {
    console.error(`Error: `, error)
  }
};



