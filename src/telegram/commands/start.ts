import { Context, Telegraf } from "telegraf"
import { CommandStartCallbacks, StartCommandHadler } from "./inlineKeyboard"
import { regexPattern, tryCatch } from "../services/utils"
import { saveBotMessage } from "../../userState"
import { ExerciseTesting } from "../services/updateMethod/inlineKeyboard"
import { ExerciseQueryFetcher } from "../services/getMethod/queries"

export const commandTesting = async (ctx: Context, bot: Telegraf) => {
  const data = await ExerciseQueryFetcher.ExerciseById(ctx.from!.id)
  const response = new ExerciseTesting(ctx, data)
  try {
    const message = await response.sendCompleteMessage(ctx)
    saveBotMessage(ctx, message.message_id)
    bot.action(/.*/, async (ctx) => {
      const action = ctx.match[0]
      await tryCatch(() => response.handleOptions(ctx, message, action), ctx)
    })
  } catch (error) {
    console.error(`Errror :`, error)
  }
}

export const commandStart = async (ctx: Context, bot: Telegraf) => {
  const response = new StartCommandHadler()
  try {
    const message = await response.sendCompleteMessage(ctx)
    saveBotMessage(ctx, message.message_id)
    bot.action(regexPattern(CommandStartCallbacks), async (ctx) => {
      const action = ctx.match[0]
      await tryCatch(() => response.handleOptions(ctx, message, action), ctx)
    })
  } catch (error) {
    console.error(`Error: `, error)
  }
}

export const setUpHolaCommand = async (bot: Telegraf) => {
  bot.command(`start`, async (ctx: Context) => {
    await commandStart(ctx, bot)
  })
}








