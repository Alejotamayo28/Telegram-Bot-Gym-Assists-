import { Context } from "telegraf";
import { sendMenuFunctions } from "../../menus/userMenu";
import { findExercisesByDay, graphic, handleOutputDailyExercise } from "./functions";
import { deleteLastMessage } from "../utils";
import { handleIncorrectDayInput, verifyDayInput } from "../addMethod/functions";
import { UserStateManager } from "../../../userState";
import { onSession } from "../../../database/dataAccessLayer";
import { handleExerciseNotFound } from "../updateMethod/functions";
import { handleError } from "../../../errors";

export const getDayExercisesGraphic = async (ctx: Context, userMessage: string) => {
  await ctx.deleteMessage()
  if (!verifyDayInput(userMessage)) {
    await handleIncorrectDayInput(ctx)
    await ctx.deleteMessage()
    return
  }
  const image = await graphic(ctx.from!.id, userMessage)
  const response = ctx.replyWithPhoto({
    source: image, filename: 'exercise_chart.png'
  }, {
    caption: `Gráfico de ejercicios del dia ${userMessage}`
  });
  await response
  await sendMenuFunctions(ctx)
}

export const handleGetDailyExercises = async (ctx: Context, userMessage: string): Promise<void> => {
  try {
    await deleteLastMessage(ctx)
    const userId = ctx.from!.id
    if (!verifyDayInput(userMessage)) {
      await handleIncorrectDayInput(ctx)
      await ctx.deleteMessage()
      return
    }
    UserStateManager.updateUserDay(userId, userMessage)
    const day = UserStateManager.getUserDay(userId)
    await onSession(async (clientTransaction) => {
      const exercise = await findExercisesByDay(clientTransaction, day, userId)
      if (!exercise) {
        await handleExerciseNotFound(ctx)
        await ctx.deleteMessage()
        return
      }
      await ctx.deleteMessage()
      const formattedOutput = handleOutputDailyExercise(exercise)
      const formattedDay = day.toUpperCase()
      await ctx.reply(`*${formattedDay}:*\n${formattedOutput}`, { parse_mode: `MarkdownV2` })
      await sendMenuFunctions(ctx)
    })
  } catch (error) {
    return handleError(error, UserStateManager.getUserStage(ctx.from!.id), ctx)
  }
}
