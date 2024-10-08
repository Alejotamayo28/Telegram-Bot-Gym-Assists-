import { Context } from "telegraf";
import {
  deleteLastMessage,
  handleIncorrectExerciseNameInput,
  verifyExerciseName,
} from "../utils";
import { UserStateManager } from "../../../userState";
import { bot } from "../../bot";
import { EXERCISE_DELETE_NAME } from "./messages";
import {
  handleIncorrectDayInput,
  verifyDayInput,
} from "../addMethod/functions";
import { deleteExerciseVerificationMenu } from ".";

export const handleDeleteExerciseDay = async (
  ctx: Context,
  userMessage: string,
) => {
  if (!verifyDayInput(userMessage)) {
    await deleteUserMessage(ctx);
    await ctx.deleteMessage();
    await handleIncorrectDayInput(ctx);
    return;
  }
  await deleteUserMessage(ctx);
  const userManager = new UserStateManager(ctx.from!.id);
  userManager.updateData(
    { day: userMessage.toLowerCase() }, "menu_delete_exercise_name",);
  await ctx.reply(EXERCISE_DELETE_NAME, {
    parse_mode: "Markdown",
  });
  await ctx.deleteMessage();
};

export const handleDeleteExerciseName = async (
  ctx: Context,
  userMessage: string,
) => {
  if (!(await verifyExerciseName(userMessage, ctx))) {
    await deleteUserMessage(ctx);
    await handleIncorrectExerciseNameInput(ctx);
    await ctx.deleteMessage();
    return;
  }
  await deleteUserMessage(ctx);
  const userManager = new UserStateManager(ctx.from!.id);
  userManager.updateData({ name: userMessage.toLowerCase() });
  await deleteLastMessage(ctx);
  await deleteExerciseVerificationMenu(bot, ctx);
};

export const deleteUserMessage = async (ctx: Context) => {
  if (ctx.message && "message_id" in ctx.message) {
    try {
      await ctx.deleteMessage(ctx.message.message_id - 1);
    } catch (e) {
      console.log(`Error al eliminar el mensaje del usuario: `, e);
    }
  }
};
