import { QueryResult } from "pg";
import { Client, userStateData } from "../../model/client";
import { UserStateManager, updateUserState, userSession, userState } from "../../userState";
import { Context } from "telegraf";
import { compare } from "bcryptjs";
import { mainMenuPage } from "../../telegram/mainMenu";
import { bot } from "..";
import { deleteLastMessage } from ".";
import { pool } from "../../database/database";
import { Message } from "telegraf/typings/core/types/typegram";

export const findUserByNickname = async (nickname: string): Promise<Client | undefined> => {
  const response: QueryResult = await pool.query(
    `SELECT nickname, password FROM client WHERE nickname = $1`, [nickname])
  return response.rowCount ? response.rows[0] : null
}

export const handleUserNotFound = async (ctx: Context) => {
  await ctx.reply(`Usuario no encontrado, vuelve a escribir tu nickname: .`)
  updateUserState(ctx.from!.id, { stage: `login_nickname` })
}

export const handleLoginNickname = async (ctx: Context) => {
  await deleteLastMessage(ctx)
  const message = ctx.message as Message.TextMessage | undefined
  const userMessage = message!.text
  const user = await findUserByNickname(userMessage!)
  if (!user) {
    await handleUserNotFound(ctx)
    await ctx.deleteMessage()
    return
  }
  await ctx.deleteMessage();
  userSession.setPassword(user!.password);
  updateUserState(ctx.from!.id, { stage: 'login_password' })
  await ctx.reply('Por favor, proporciona tu contraseña');
}

export const handleLoginPassword = async (ctx: Context, userId: number, userMessage: string) => {
  await deleteLastMessage(ctx)
  const userManager = new UserStateManager<userStateData>(userId)
  userManager.updateData({ password: userMessage })
  const isPasswordIncorrect = await verifyPassword(userManager.getUserData().password!, userSession.getPassword())
  if (!isPasswordIncorrect) {
    await handleIncorrectPassword(ctx)
    await ctx.deleteMessage()
    return
  }
  await ctx.deleteMessage()
  delete userState[userId]
  await mainMenuPage(bot, ctx)
}

export const verifyPassword = async (inputPassword: string, storedPassword: string) => {
  return compare(inputPassword, storedPassword)
}

export const handleIncorrectPassword = async (ctx: Context) => {
  await ctx.reply('Contraseña incorrecta, vuelve a escribirla!');
  updateUserState(ctx.from!.id, { stage: 'login_password' })
}
