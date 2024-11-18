import { Context } from "telegraf"
import { deleteBotMessage, deleteUserMessage, saveBotMessage, userStageSignUp, userState, userStateUpdateEmail, userStateUpdateNickname, userStateUpdatePassword, userStateUpdateStage } from "../../../userState"
import { encrypt } from "../../../middlewares/jsonWebToken/enCryptHelper"
import { deleteLastMessage } from "../utils"
import { signUpVerificationController, signUpVerificationMenu } from "."
import { bot } from "../../bot"
import { findUserByNickname } from "../login/functions"
import { SIGN_UP_EMAIL, SIGN_UP_NICKNAME_NOT_AVAIBLABLE, SIGN_UP_PASSWORD } from "./message"

export const handleNicknameNotAvailable = async (ctx: Context) => {
  const response = await ctx.reply(SIGN_UP_NICKNAME_NOT_AVAIBLABLE, {
    parse_mode: "Markdown"
  })
  saveBotMessage(ctx, response.message_id)
  userStateUpdateStage(ctx, userStageSignUp.SIGN_UP_NICKNAME)
}

export const handleSignUpNickname = async (ctx: Context, userMessage: string) => {
  const user = await findUserByNickname(userMessage!.toLowerCase())
  if (user) {
    await handleNicknameNotAvailable(ctx)
    await deleteUserMessage(ctx)
    return
  }
  await deleteUserMessage(ctx)
  userStateUpdateNickname(ctx, userMessage, userStageSignUp.SIGN_UP_PASSWORD)
  const response = await ctx.reply(SIGN_UP_PASSWORD, {
    parse_mode: "Markdown"
  })
  saveBotMessage(ctx, response.message_id)
}

export const handleSignUpPassword = async (ctx: Context, userMessage: string) => {
  await deleteUserMessage(ctx)
  userStateUpdatePassword(ctx, userMessage, userStageSignUp.SIGN_UP_EMAIL)
  const response = await ctx.reply(SIGN_UP_EMAIL, {
    parse_mode: "Markdown"
  })
  saveBotMessage(ctx, response.message_id)
}

export const handleSignUpEmail = async (ctx: Context, userMessage: string) => {
  await deleteUserMessage(ctx)
  userStateUpdateEmail(ctx, userMessage)
  const passwordHash = await encrypt(userState[ctx.from!.id].password)
  await signUpVerificationController(ctx, bot, passwordHash)
  delete userState[ctx.from!.id]
}





