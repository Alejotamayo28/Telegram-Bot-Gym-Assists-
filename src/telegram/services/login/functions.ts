import { compare } from "bcryptjs"
import { Context, Telegraf } from "telegraf"
import { BotStage, deleteUserMessage, getUserCredentials, updateUserState } from "../../../userState"
import { mainMenuPage } from "../../mainMenu"
import { botMessages } from "../../messages"
import { BotUtils } from "../singUp/functions"
import { UserQueryFetcher } from "./queries"

export class LoginHandler {
  private static async handleLoginError(ctx: Context,
    errorType: keyof typeof botMessages.inputRequest.auth.errors): Promise<void> {
    const errorMessage = botMessages.inputRequest.auth.errors[errorType]
    await BotUtils.sendBotMessage(ctx, errorMessage)
  }
  private static async verifyPassword(inputPassword: string, storedPassword: string): Promise<boolean> {
    return compare(inputPassword, storedPassword)
  }
  static async loginNickname(ctx: Context, userMessage: string): Promise<void> {
    await deleteUserMessage(ctx)
    const user = await UserQueryFetcher.userNicknamePasswordByNickname(userMessage)
    if (!user) {
      await this.handleLoginError(ctx, "invalidNickname")
      return
    }
    updateUserState(ctx.from!.id, {
      stage: BotStage.Auth.PASSWORD,
      data: {
        credentials: {
          nickname: user.nickname,
          password: user.password
        }
      }
    })
    await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.auth.password)
  }
  static async loginPassword(ctx: Context, bot: Telegraf, inputPassword: string): Promise<void> {
    await deleteUserMessage(ctx)
    const { password } = getUserCredentials(ctx.from!.id)
    const isPasswordValid = await this.verifyPassword(inputPassword, password)
    if (!isPasswordValid) {
      await this.handleLoginError(ctx, "invalidPassword")
      return
    }
    return await mainMenuPage(ctx, bot)
  }
}

