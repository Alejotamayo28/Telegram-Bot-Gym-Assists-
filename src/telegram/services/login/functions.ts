import { compare } from "bcryptjs"
import { Client, QueryResult } from "pg"
import { Context } from "telegraf"
import { deleteLastMessage } from "../utils"
import { pool } from "../../../database/database"
import {  userStage, userState,  userStateUpdatePassword, userStateUpdateStage } from "../../../userState"
import { bot } from "../../bot"
import { mainMenuPage } from "../../mainMenu"
import { LOGIN_NICKNAME_NOT_FOUND, LOGIN_PASSWORD_INCORRECT, LOGIN_REQUEST_PASSWORD_MESSAGE } from "./messages"

export const handleLoginNickname = async (ctx: Context, userMessage: string) => {
  await deleteLastMessage(ctx)
  const user = await findUserByNickname(userMessage)
  if (!user) {
    await handleUserNotFound(ctx)
    await ctx.deleteMessage()
    return
  }
  userStateUpdatePassword(ctx, user.password!, userStage.LOGIN_PASSWORD)
  await ctx.deleteMessage()
  await ctx.reply(LOGIN_REQUEST_PASSWORD_MESSAGE, {
    parse_mode: "Markdown"
  });
}

export const handleLoginPassword = async (ctx: Context, userMessage: string) => {
  await deleteLastMessage(ctx)
  const isPasswordIncorrect = await verifyPassword(userMessage, userState[ctx.from!.id].password)
  if (!isPasswordIncorrect) {
    await handleIncorrectPassword(ctx)
    await ctx.deleteMessage()
    return
  }
  await ctx.deleteMessage()
  delete userState[ctx.from!.id]
  await mainMenuPage(bot, ctx)
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
