import { Context, Telegraf } from "telegraf"
import { deleteUserMessage, saveBotMessage, userStageSignUp, userState, userStateUpdateEmail, userStateUpdateNickname, userStateUpdatePassword, userStateUpdateStage } from "../../../userState"
import { encrypt } from "../../../middlewares/jsonWebToken/enCryptHelper"
import { signUpVerificationController } from "."
import { findUserByNickname } from "../login/functions"
import { botMessages } from "../../messages"
import { InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram"

export class BotUtils {
  public static async sendBotMessage(ctx: Context, message: string, keyboard?: InlineKeyboardMarkup) {
    if (keyboard) {
      const response = await ctx.reply(message, { parse_mode: "Markdown", reply_markup: keyboard })
      saveBotMessage(ctx, response.message_id)
    } else {
      const response = await ctx.reply(message, { parse_mode: "Markdown" })
      saveBotMessage(ctx, response.message_id)
    }
  }
}

export class RegisterHandler {
  private static async handleRegistrationError(ctx: Context, errorType: keyof typeof botMessages.inputRequest.register.errors): Promise<void> {
    const errorMessage = botMessages.inputRequest.register.errors[errorType]
    await BotUtils.sendBotMessage(ctx, errorMessage)
    userStateUpdateStage(ctx, userStageSignUp.SIGN_UP_NICKNAME)
  }
  static async registerNickname(ctx: Context, userMessage: string): Promise<void> {
    await deleteUserMessage(ctx)
    const user = await findUserByNickname(userMessage.toLowerCase())
    if (user) {
      await this.handleRegistrationError(ctx, "invalidNickname")
      return
    }
    userStateUpdateNickname(ctx, userMessage, userStageSignUp.SIGN_UP_PASSWORD)
    await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.register.password)
  }
  static async registerPassword(ctx: Context, userMessage: string): Promise<void> {
    await deleteUserMessage(ctx)
    userStateUpdatePassword(ctx, userMessage, userStageSignUp.SIGN_UP_EMAIL)
    await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.register.email)
  }
  static async registerEmail(ctx: Context, bot: Telegraf, userMessage: string): Promise<void> {
    await deleteUserMessage(ctx)
    userStateUpdateEmail(ctx, userMessage)
    const password = userState[ctx.from!.id].password
    const passwordHash = await encrypt(password)
    await signUpVerificationController(ctx, bot, passwordHash)
  }
}


