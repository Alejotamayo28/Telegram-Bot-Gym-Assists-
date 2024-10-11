import { Context, Telegraf } from "telegraf"
import { userState } from "../../userState"
import { DELETE_EXERCISE_CALLBACK, GET_EXERCISE_DAY_CALLBACK, GET_EXERCISE_WEEK_CALLBACK, POST_EXERCISE_CALLBACK, UPDATE_EXERCISE_CALLBACK } from "./buttons"
import { inlineKeyboardMenu } from "./inlineKeyboard"
import { sendMenuFunctions } from "../menus/userMenu"
import { GET_EXERCISE_DAY_OUTPUT, POST_EXERCISE_DAY_OUTPUT } from "./messages"
import { MAIN_MENU_MESSAGE } from "../messages/mainMenuMessage"
import { UPDATE_EXERCISE_DAY_OUTPUT } from "../services/updateMethod/message"
import { DELETE_EXERICISE_DAY } from "../services/deleteMethod/messages"
import { handleGetWeeklyExercises } from "../services/getMethod"

export const mainMenuPage = async (bot: Telegraf, ctx: Context) => {
  await ctx.reply(MAIN_MENU_MESSAGE, {
    parse_mode: "Markdown",
    reply_markup: inlineKeyboardMenu.reply_markup
  })
  bot.action(POST_EXERCISE_CALLBACK, async (ctx: Context) => {
     await ctx.reply(POST_EXERCISE_DAY_OUTPUT, {
      parse_mode: "MarkdownV2",
    })
    userState[ctx.from!.id] = { stage: 'menu_post_exercise_day' }
  })

  bot.action(UPDATE_EXERCISE_CALLBACK, async (ctx: Context) => {
    await ctx.reply(UPDATE_EXERCISE_DAY_OUTPUT, {
      parse_mode: "MarkdownV2"
    })
    userState[ctx.from!.id] = { stage: 'menu_put_exercise_day' }
  })

  bot.action(GET_EXERCISE_DAY_CALLBACK, async (ctx: Context) => {
    await ctx.reply(GET_EXERCISE_DAY_OUTPUT, {
      parse_mode: "MarkdownV2"
    })
    userState[ctx.from!.id] = { stage: 'menuGetExerciseOptions' }
  })

  bot.action(GET_EXERCISE_WEEK_CALLBACK, async (ctx: Context) => {
    await handleGetWeeklyExercises(ctx)
    await sendMenuFunctions(ctx)
  })

  bot.action(DELETE_EXERCISE_CALLBACK, async (ctx: Context) => {
    await ctx.reply(DELETE_EXERICISE_DAY, {
      parse_mode: "Markdown"
    })
    userState[ctx.from!.id] = { stage: 'menu_delete_exercise_day' }
  })
}



