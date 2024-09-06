import { Context } from "telegraf"
import { UserStateManager, updateUserState, userState } from "../../../userState"
import { findUserByNickname } from "../../../bot/functions/login"
import { encrypt } from "../../../middlewares/jsonWebToken/enCryptHelper"
import { deleteLastMessage } from "../../../bot/functions"
import { userStateData } from "../../../model/client"
import { signUpVerificationMenu } from "."
import { bot } from "../../bot"
import { Message } from "telegraf/typings/core/types/typegram"

export const handleNicknameNotAvailable = async (ctx: Context) => {
  await ctx.reply(`Usuario no disponible, crea otro nickname!`)
  updateUserState(ctx.from!.id, { stage: 'signUp_nickname' })
}

export const handleSignUpNickname = async (ctx: Context) => {
  const userId = ctx.from!.id
  const message = ctx.message as Message.TextMessage | undefined
  const userMessage = message?.text
  console.log(userMessage)

  await deleteLastMessage(ctx)

  const user = await findUserByNickname(userMessage!.toLowerCase())
  if (user) {
    await handleNicknameNotAvailable(ctx)
    ctx.deleteMessage()
    return
  }
  await ctx.deleteMessage()
  const userManager = new UserStateManager(userId)
  userManager.updateData({ nickname: userMessage }, 'signUp_password')
  await ctx.reply(`¡Nickname guardado! Ahora, por favor ingresa tu contraseña.`)
}

export const handleSignUpPassword = async (ctx: Context) => {
  const userId = ctx.from!.id
  const message = ctx.message as Message.TextMessage | undefined
  const userMessage = message?.text

  await deleteLastMessage(ctx)

  const userManager = new UserStateManager<userStateData>(userId)
  userManager.updateData({ password: userMessage }, 'signUp_email')
  await ctx.reply(`¡Contraseña guardada! Ahora, por favor ingresa tu email.`)
  await ctx.deleteMessage()
}


export const handleSignUpEmail = async (ctx: Context) => {
  const userId = ctx.from!.id
  const message = ctx.message as Message.TextMessage | undefined
  const userMessage = message?.text

  await deleteLastMessage(ctx)

  const userManager = new UserStateManager<userStateData>(userId)
  userManager.updateData({ email: userMessage })
  await ctx.deleteMessage()
  const passwordHash = await encrypt(userManager.getUserData().password)
  await signUpVerificationMenu(bot, ctx, passwordHash)
  delete userState[userId]
}





