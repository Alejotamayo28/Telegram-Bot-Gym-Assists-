import { Context, Telegraf } from "telegraf"
import { MainMenuHandler, MainMenuHandlerWithTaskDone } from "./inlineKeyboard"
import { regexPattern, tryCatch } from "../services/utils"
import { MainMenuCallbacks, ReturnMainMenuCallbacks } from "./models"
import { saveBotMessage } from "../../userState"


export const mainMenuPage = async (ctx: Context, bot: Telegraf, message?: string) => {
  const response = new MainMenuHandler(message)
  try {
    const message = await response.sendCompleteMessage(ctx)
    saveBotMessage(ctx, message.message_id)
    bot.action(regexPattern(MainMenuCallbacks), async (ctx) => {
      const action = ctx.match[0]
      await tryCatch(() => response.handleOptions(ctx, message, action, bot), ctx)
    })
  } catch (error) {
    console.error(`Error: `, error)
  }
}

export const redirectToMainMenuWithTaskDone = async (ctx: Context, bot: Telegraf, taskDone?: string) => {
  const response = new MainMenuHandlerWithTaskDone(taskDone)
  try {
    const message = await response.sendCompleteMessage(ctx)
    saveBotMessage(ctx, message.message_id)
    bot.action(regexPattern(ReturnMainMenuCallbacks), async (ctx) => {
      const action = ctx.match[0]
      await tryCatch(() => response.handleOptions(ctx, message, action, bot), ctx)
    })
  } catch (error) {
    console.error(`Error: `, error)
  }
}



