import { Context } from "telegraf";
import { userStageDeleteExercise, userStateUpdateDay } from "../../../userState";
import { bot } from "../../bot";
import { EXERCISE_DELETE_NAME } from "./messages";
import { deleteExerciseVerificationMenu } from ".";

export const handleDeleteExerciseDay = async (ctx: Context, userMessage: string) => {
  try {
    userStateUpdateDay(ctx,userMessage, userStageDeleteExercise.DELETE_EXERCISE_NAME)
    await ctx.deleteMessage()
    await ctx.reply(EXERCISE_DELETE_NAME, {
      parse_mode: "Markdown",
    });
  } catch (error) {
    console.error(`Error: `, error)
  }
};

export const handleDeleteExerciseName = async (ctx: Context) => {
  try {
    await ctx.deleteMessage()
    await deleteExerciseVerificationMenu(bot, ctx);
  } catch (error) {
    console.error(`Error: `, error)
  }
};

