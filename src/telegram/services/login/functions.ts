import { compare } from "bcryptjs"
import { Client, QueryResult } from "pg"
import { Context } from "telegraf"
import { pool } from "../../../database/database"
import { deleteUserMessage, userStage, userState, userStateUpdatePassword, userStateUpdateStage } from "../../../userState"
import { bot } from "../../bot"
import { mainMenuPage } from "../../mainMenu"
import { LOGIN_NICKNAME_NOT_FOUND, LOGIN_PASSWORD_INCORRECT, LOGIN_REQUEST_PASSWORD_MESSAGE } from "./messages"

export const handleLoginNickname = async (ctx: Context, userMessage: string) => {
  const user = await findUserByNickname(userMessage)
  if (!user) {
    await handleUserNotFound(ctx)
    await deleteUserMessage(ctx)
    return
  }
  userStateUpdatePassword(ctx, user.password!, userStage.LOGIN_PASSWORD)
  await deleteUserMessage(ctx)
  await ctx.reply(LOGIN_REQUEST_PASSWORD_MESSAGE, {
    parse_mode: "Markdown"
  });
}

export const handleLoginPassword = async (ctx: Context, userMessage: string) => {
  const isPasswordIncorrect = await verifyPassword(userMessage, userState[ctx.from!.id].password)
  if (!isPasswordIncorrect) {
    await handleIncorrectPassword(ctx)
    await deleteUserMessage(ctx)
    return
  }
  await deleteUserMessage(ctx)
  delete userState[ctx.from!.id]
  await mainMenuPage(ctx, bot)
}


export const findUserByNickname = async (nickname: string): Promise<Client | undefined> => {
  const response: QueryResult = await pool.query(
    `SELECT nickname, password FROM client WHERE nickname = $1`, [nickname])
  return response.rowCount ? response.rows[0] : null
}

export const handleUserNotFound = async (ctx: Context) => {
  await ctx.reply(LOGIN_NICKNAME_NOT_FOUND, {
    parse_mode: "Markdown"
  })
  userStateUpdateStage(ctx, 'login_nickname')
}

export const verifyPassword = async (inputPassword: string, storedPassword: string) => {
  return compare(inputPassword, storedPassword)
}

export const handleIncorrectPassword = async (ctx: Context) => {
  await ctx.reply(LOGIN_PASSWORD_INCORRECT, {
    parse_mode: "Markdown"
  });
  userStateUpdateStage(ctx, 'login_password')
}
