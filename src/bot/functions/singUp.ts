import { Context } from "telegraf"
import { userState } from "../../userState"
import { findUserByNickname } from "./login"
import { PoolClient } from "pg"
import { encrypt } from "../../middlewares/jsonWebToken/enCryptHelper"
import { startInlineKeyboard } from "../../telegram/commands/inlineKeyboard"

export const handleNicknameNotAvailable = async (ctx: Context, userId: number) => {
  await ctx.reply(`Usuario no disponible, crea otro nickname!`)
  userState[userId] = { ...userState[userId], stage: 'signUp_nickname' }
}

export const handleSignUpNickname = async (ctx: Context, userId: number, userMessage: string, client: PoolClient) => {
  await ctx.deleteMessage(ctx.message!.message_id - 1)
  userState[userId] = { ...userState[userId], nickname: userMessage.toLowerCase() }
  const user = await findUserByNickname(client, userState[userId].nickname)
  if (user) {
    await handleNicknameNotAvailable(ctx, userId)
    ctx.deleteMessage()
    return
  }
  await ctx.deleteMessage()
  userState[userId] = { ...userState[userId], stage: 'signUp_password' }
  await ctx.reply(`Por favor, proporciona una contrasena!`)
}

export const handleSignUpPassword = async (ctx: Context, userId: number, userMessage: string) => {
  await ctx.deleteMessage(ctx.message!.message_id - 1)
  userState[userId] = {
    ...userState[userId], password: userMessage.toLowerCase(),
    stage: 'signUp_email'
  }
  await ctx.reply(`Por favor, proporciona un correo electronico`)
  await ctx.deleteMessage()
}

export const signUpUser = async (userId: number, passwordHash: string, client: PoolClient) => {
  await client.query(
    `INSERT INTO client (id, nickname, password, email) VALUES ($1, $2, $3, $4)`,
    [userId, userState[userId].nickname, passwordHash, userState[userId].email]
  );
}


export const handleSignUpEmail = async (ctx: Context, userId: number, userMessage: string, client: PoolClient) => {
  await ctx.deleteMessage(ctx.message!.message_id - 1)
  userState[userId] = {
    ...userState[userId], email: userMessage,
    stage: 'singUp_done'
  }
  await ctx.deleteMessage()
  const passwordHash = await encrypt(userState[userId].password)
  await signUpUser(userId, passwordHash, client)
  delete userState[userId]
  await ctx.reply(`Gracias por haber creado tu cuenta.\nAhora, por favor inicia seccion para continuar `,
    startInlineKeyboard)
}
