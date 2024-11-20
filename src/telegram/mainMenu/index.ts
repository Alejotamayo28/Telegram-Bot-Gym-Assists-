import { Context, Telegraf } from "telegraf"
import { MainMenuHandler, MainMenuRedirectHandler } from "./inlineKeyboard"
import { regexPattern, tryCatch } from "../services/utils"
import { MainMenuCallbacks, ReturnMainMenuCallbacks } from "./models"


export const mainMenuPage = async (ctx: Context, bot: Telegraf) => {
  const response = new MainMenuHandler()
  try {
    const message = await response.sendCompleteMessage(ctx)
    bot.action(regexPattern(MainMenuCallbacks), async (ctx) => {
      const action = ctx.match[0]
      await tryCatch(() => response.handleOptions(ctx, message, action), ctx)
    })
  } catch (error) {
    console.error(`Error: `, error)
  }
}

export const redirectToMainMenuWithTaskDone = async (ctx: Context, bot: Telegraf, taskDone?: string) => {
  const response = new MainMenuRedirectHandler(taskDone)
  try {
    const message = await response.sendCompleteMessage(ctx)
    bot.action(regexPattern(ReturnMainMenuCallbacks), async (ctx) => {
      const action = ctx.match[0]
      await tryCatch(() => response.handleOptions(ctx, message, action, bot), ctx)
    })
  } catch (error) {
    console.error(`Error: `, error)
  }
}



