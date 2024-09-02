import { Context } from "telegraf"
import { UserStateManager, updateUserState, userState } from "../../userState"
import { findUserByNickname } from "./login"
import { PoolClient } from "pg"
import { encrypt } from "../../middlewares/jsonWebToken/enCryptHelper"
import { startInlineKeyboard } from "../../telegram/commands/inlineKeyboard"
import { deleteLastMessage } from "."
import { userStateData } from "../../model/client"

export const handleNicknameNotAvailable = async (ctx: Context, userId: number) => {
  await ctx.reply(`Usuario no disponible, crea otro nickname!`)
  updateUserState(userId, { stage: 'signUp_nickname' })
}

export const handleSignUpNickname = async (ctx: Context, userId: number, userMessage: string, client: PoolClient) => {
  await deleteLastMessage(ctx)
  const user = await findUserByNickname(client, userMessage.toLowerCase())
  if (user) {
    await handleNicknameNotAvailable(ctx, userId)
    ctx.deleteMessage()
    return
  }
  await ctx.deleteMessage()
  const userManager = new UserStateManager(userId)
  userManager.updateData({ nickname: userMessage }, 'signUp_password')


  await ctx.reply(`Por favor, proporciona una contrasena!`)
}

export const handleSignUpPassword = async (ctx: Context, userId: number, userMessage: string) => {
  await deleteLastMessage(ctx)
  const userManager = new UserStateManager<userStateData>(userId)
  userManager.updateData({ password: userMessage }, 'signUp_email')
  await ctx.reply(`Por favor, proporciona un correo electronico`)
  await ctx.deleteMessage()
}


export const handleSignUpEmail = async (ctx: Context, userId: number, userMessage: string, client: PoolClient) => {
  await deleteLastMessage(ctx)
  const userManager = new UserStateManager<userStateData>(userId)
  userManager.updateData({ email: userMessage })
  await ctx.deleteMessage()
  const passwordHash = await encrypt(userManager.getUserData().password)
  await signUpUser(userId, passwordHash, client)
  delete userState[userId]
  await ctx.reply(`Gracias por haber creado tu cuenta.\nAhora, por favor inicia seccion para continuar `,
    startInlineKeyboard)
}

export const signUpUser = async (userId: number, passwordHash: string, client: PoolClient) => {
  const userManager = new UserStateManager<userStateData>(userId)
  const { nickname, email } = userManager.getUserData()
  await client.query(
    `INSERT INTO client (id, nickname, password, email) VALUES ($1, $2, $3, $4)`,
    [userId, nickname, passwordHash, email]
  );
}


