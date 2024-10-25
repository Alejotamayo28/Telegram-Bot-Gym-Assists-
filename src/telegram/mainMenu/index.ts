import { Context, Telegraf } from "telegraf"
import { userStageDeleteExercise, userStageGetExercise, userStagePostExercise, userStagePutExercise, userStateUpdateStage } from "../../userState"
import { DELETE_EXERCISE_CALLBACK, GET_EXERCISE_DAY_CALLBACK, GET_EXERCISE_WEEK_CALLBACK, POST_EXERCISE_CALLBACK, UPDATE_EXERCISE_CALLBACK } from "./buttons"
import { inlineKeyboardMenu } from "./inlineKeyboard"
import { sendMenuFunctions } from "../menus/userMenu"
import { GET_EXERCISE_DAY_OUTPUT, POST_EXERCISE_DAY_OUTPUT } from "./messages"
import { MAIN_MENU_MESSAGE } from "../messages/mainMenuMessage"
import { UPDATE_EXERCISE_DAY_OUTPUT } from "../services/updateMethod/message"
import { DELETE_EXERICISE_DAY } from "../services/deleteMethod/messages"
import { handleGetExercisesByInterval, handleGetExercisesOptions, handleGetWeeklyExercises } from "../services/getMethod"
import { inlineKeyboardGetMenu, testingGet } from "../services/getMethod/inlineKeyboard"

export const mainMenuPage = async (ctx: Context, bot: Telegraf) => {
  await ctx.reply(MAIN_MENU_MESSAGE, {
    parse_mode: "Markdown",
    reply_markup: inlineKeyboardMenu.reply_markup
  })
  bot.action(POST_EXERCISE_CALLBACK, async (ctx: Context) => {
    await ctx.reply(POST_EXERCISE_DAY_OUTPUT, {
      parse_mode: "MarkdownV2",
    })
    userStateUpdateStage(ctx, userStagePostExercise.POST_EXERCISE_DAY)
  })
  bot.action(UPDATE_EXERCISE_CALLBACK, async (ctx: Context) => {
    await ctx.reply(UPDATE_EXERCISE_DAY_OUTPUT, {
      parse_mode: "MarkdownV2"
    })
    userStateUpdateStage(ctx, userStagePutExercise.PUT_EXERCISE_DAY)
  })
  bot.action(GET_EXERCISE_DAY_CALLBACK, async (ctx: Context) => {
    await handleGetExercisesOptions(ctx, bot)
  })
  bot.action(GET_EXERCISE_WEEK_CALLBACK, async (ctx: Context) => {
    await handleGetWeeklyExercises(ctx)
    await sendMenuFunctions(ctx)
  })

  bot.action(DELETE_EXERCISE_CALLBACK, async (ctx: Context) => {
    await ctx.reply(DELETE_EXERICISE_DAY, {
      parse_mode: "Markdown"
    })
    userStateUpdateStage(ctx, userStageDeleteExercise.DELETE_EXERCISE_DAY)
  })
}



