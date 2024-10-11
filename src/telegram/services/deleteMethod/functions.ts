import { Context } from "telegraf";
import { userState } from "../../../userState";
import { bot } from "../../bot";
import { EXERCISE_DELETE_NAME } from "./messages";
import { deleteExerciseVerificationMenu } from ".";

export const handleDeleteExerciseDay = async (ctx: Context, userMessage: string) => {
  try {
    userState[ctx.from!.id] = {
      ...userState[ctx.from!.id],
      day: userMessage,
      stage: 'menu_delete_exercise_name'
    }
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

