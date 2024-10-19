import { Context } from "telegraf"
import { userStageSignUp, userState, userStateUpdateEmail, userStateUpdateNickname, userStateUpdatePassword, userStateUpdateStage } from "../../../userState"
import { encrypt } from "../../../middlewares/jsonWebToken/enCryptHelper"
import { deleteLastMessage } from "../utils"
import { signUpVerificationMenu } from "."
import { bot } from "../../bot"
import { findUserByNickname } from "../login/functions"
import { SIGN_UP_EMAIL, SIGN_UP_NICKNAME_NOT_AVAIBLABLE, SIGN_UP_PASSWORD } from "./message"

export const handleNicknameNotAvailable = async (ctx: Context) => {
  await ctx.reply(SIGN_UP_NICKNAME_NOT_AVAIBLABLE, {
    parse_mode: "Markdown"
  })
  userStateUpdateStage(ctx, 'signUp_nickname')
}

export const handleSignUpNickname = async (ctx: Context, userMessage: string) => {
  await deleteLastMessage(ctx)
  const user = await findUserByNickname(userMessage!.toLowerCase())
  if (user) {
    await handleNicknameNotAvailable(ctx)
    ctx.deleteMessage()
    return
  }
  await ctx.deleteMessage()
  userStateUpdateNickname(ctx, userMessage, userStageSignUp.SIGN_UP_PASSWORD)
  await ctx.reply(SIGN_UP_PASSWORD, {
    parse_mode: "Markdown"
  })
}

export const handleSignUpPassword = async (ctx: Context, userMessage: string) => {
  await deleteLastMessage(ctx)
  userStateUpdatePassword(ctx, userMessage, userStageSignUp.SIGN_UP_EMAIL)
  await ctx.reply(SIGN_UP_EMAIL, {
    parse_mode: "Markdown"
  })
  await ctx.deleteMessage()
}

export const handleSignUpEmail = async (ctx: Context, userMessage: string) => {
  await deleteLastMessage(ctx)
  userStateUpdateEmail(ctx, userMessage)
  await ctx.deleteMessage()
  const passwordHash = await encrypt(userState[ctx.from!.id].password)
  await signUpVerificationMenu(bot, ctx, passwordHash)
  delete userState[ctx.from!.id]
}





