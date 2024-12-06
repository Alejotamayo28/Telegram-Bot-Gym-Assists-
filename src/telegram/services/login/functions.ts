import { compare } from "bcryptjs"
import { Client, QueryResult } from "pg"
import { Context, Telegraf } from "telegraf"
import { pool } from "../../../database/database"
import { deleteUserMessage, userStage, userState, userStateUpdatePassword } from "../../../userState"
import { mainMenuPage } from "../../mainMenu"
import { botMessages } from "../../messages"
import { BotUtils } from "../singUp/functions"

export class LoginHandler {
  private static async handleLoginError(ctx: Context, errorType: keyof typeof botMessages.inputRequest.auth.errors): Promise<void> {
    const errorMessage = botMessages.inputRequest.auth.errors[errorType]
    await BotUtils.sendBotMessage(ctx, errorMessage)
  }
  private static async verifyPassword(inputPassword: string, storedPassword: string): Promise<boolean> {
    return compare(inputPassword, storedPassword)
  }
  static async loginNickname(ctx: Context, userMessage: string): Promise<void> {
    await deleteUserMessage(ctx)
    const user = await findUserByNickname(userMessage)
    if (!user) {
      await this.handleLoginError(ctx, "invalidNickname")
      return
    }
    userStateUpdatePassword(ctx, user.password!, userStage.LOGIN_PASSWORD)
    await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.auth.password)
  }
  static async loginPassword(ctx: Context, bot: Telegraf, userMessage: string): Promise<void> {
    await deleteUserMessage(ctx)
    const isPasswordValid = await this.verifyPassword(userMessage, userState[ctx.from!.id].password)
    if (!isPasswordValid) {
      await this.handleLoginError(ctx, "invalidPassword")
      return
    }
    delete userState[ctx.from!.id]
    return await mainMenuPage(ctx, bot)
  }
}

export const findUserByNickname = async (nickname: string): Promise<Client | undefined> => {
  const response: QueryResult = await pool.query(
    `SELECT nickname, password FROM client WHERE nickname = $1`, [nickname])
  return response.rowCount ? response.rows[0] : null
}
