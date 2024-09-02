import { PoolClient, QueryResult } from "pg";
import { Client } from "../../model/client";
import { userSession, userState } from "../../userState";
import { Context } from "telegraf";
import { compare } from "bcryptjs";
import { mainMenuPage } from "../../telegram/mainMenu";
import { bot } from "..";

export const findUserByNickname = async (client: PoolClient, nickname: string): Promise<Client | undefined> => {
  const response: QueryResult = await client.query(
    `SELECT nickname, password FROM client WHERE nickname = $1`, [nickname])
  return response.rowCount ? response.rows[0] : null
}

export const handleUserNotFound = async (ctx: Context, userId: number) => {
  await ctx.reply(`Usario no encontrado, vuelve a escribir tu nickname: .`)
  userState[userId] = { ...userState[userId], stage: 'login_nickname' }
}

export const handleLoginNickname = async (ctx: Context, userId: number, userMessage: string, client: PoolClient) => {
  await ctx.deleteMessage(ctx.message!.message_id - 1)
  userState[userId] = { ...userState[userId], nickname: userMessage }
  const user = await findUserByNickname(client, userState[userId].nickname)
  if (!user) {
    await handleUserNotFound(ctx, userId)
    await ctx.deleteMessage()
    return
  }
  await ctx.deleteMessage();
  userSession.setPassword(user!.password);
  userState[userId] = { ...userState[userId], stage: 'login_password' };
  await ctx.reply('Por favor, proporciona tu contraseña');
}

export const verifyPassword = async (inputPassword: string, storedPassword: string) => {
  return compare(inputPassword, storedPassword)
}

export const handleIncorrectPassword = async (ctx: Context, userId: number) => {
  await ctx.reply('Contraseña incorrecta, vuelve a escribirla!');
  userState[userId] = { ...userState[userId], stage: 'login_password' };
}
export const handleLoginPassword = async (ctx: Context, userId: number, userMessage: string) => {
  ctx.deleteMessage(ctx.message!.message_id - 1)
  userState[userId] = { ...userState[userId], password: userMessage }
  const isPasswordIncorrect = await verifyPassword(userState[userId].password, userSession.getPassword())
  if (!isPasswordIncorrect) {
    await handleIncorrectPassword(ctx, userId)
    await ctx.deleteMessage()
    return
  }
  await ctx.deleteMessage()
  delete userState[userId]
  await mainMenuPage(bot, ctx)
}



