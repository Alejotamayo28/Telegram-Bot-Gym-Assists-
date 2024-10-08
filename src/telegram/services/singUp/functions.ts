import { Context } from "telegraf"
import { UserStateManager, updateUserState, userState } from "../../../userState"
import { encrypt } from "../../../middlewares/jsonWebToken/enCryptHelper"
import { deleteLastMessage } from "../utils"
import { signUpVerificationMenu } from "."
import { bot } from "../../bot"
import { Message } from "telegraf/typings/core/types/typegram"
import { findUserByNickname } from "../login/functions"
import { SIGN_UP_EMAIL, SIGN_UP_NICKNAME_NOT_AVAIBLABLE, SIGN_UP_PASSWORD } from "./message"

export const handleNicknameNotAvailable = async (ctx: Context) => {
  await ctx.reply(SIGN_UP_NICKNAME_NOT_AVAIBLABLE, {
    parse_mode: "Markdown"
  })
  updateUserState(ctx.from!.id, { stage: 'signUp_nickname' })
}

export const handleSignUpNickname = async (ctx: Context) => {
  await deleteLastMessage(ctx)
  const userId = ctx.from!.id
  const message = ctx.message as Message.TextMessage | undefined
  const userMessage = message?.text
  const user = await findUserByNickname(userMessage!.toLowerCase())
  if (user) {
    await handleNicknameNotAvailable(ctx)
    ctx.deleteMessage()
    return
  }
  await ctx.deleteMessage()
  const userManager = new UserStateManager(userId)
  userManager.updateData({ nickname: userMessage }, 'signUp_password')
  await ctx.reply(SIGN_UP_PASSWORD, {
    parse_mode: "Markdown"
  })
}

export const handleSignUpPassword = async (ctx: Context) => {
  const userId = ctx.from!.id
  const message = ctx.message as Message.TextMessage | undefined
  const userMessage = message?.text

  await deleteLastMessage(ctx)

  const userManager = new UserStateManager(userId)
  userManager.updateData({ password: userMessage }, 'signUp_email')
  await ctx.reply(SIGN_UP_EMAIL, {
    parse_mode: "Markdown"
  })
  await ctx.deleteMessage()
}

export const handleSignUpEmail = async (ctx: Context) => {
  const userId = ctx.from!.id
  const message = ctx.message as Message.TextMessage | undefined
  const userMessage = message?.text

  await deleteLastMessage(ctx)

  const userManager = new UserStateManager(userId)
  userManager.updateData({ email: userMessage })
  await ctx.deleteMessage()
  const passwordHash = await encrypt(userManager.getUserProfile().password)
  await signUpVerificationMenu(bot, ctx, passwordHash)
  delete userState[userId]
}





