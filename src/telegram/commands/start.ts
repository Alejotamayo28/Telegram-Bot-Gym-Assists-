import { Context, Telegraf } from "telegraf"
import { CommandStartCallbacks, StartCommandHadler } from "./inlineKeyboard"
import { regexPattern, tryCatch } from "../services/utils"
import { saveBotMessage } from "../../userState"

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








