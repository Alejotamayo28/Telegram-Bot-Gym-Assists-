import { Context, Telegraf } from "telegraf"
import { welcomeMessage } from "../messages/welcomeMessage"
import { userState } from "../../userState"
import { startInlineKeyboard } from "./inlineKeyboard"
import { SIGN_UP_CALLBACK, SIGN_UP_EXAMPLE_CALLBACK } from "../services/singUp/buttons"
import { SING_UP_EXAMPLE_MESSAGE } from "../services/singUp/message"
import { LOGIN_REQUEST_NICKNAME_MESSAGE, LOGIN_EXAMPLE_INFO_MESSAGE } from "../messages/singUpLoginMessages"
import { LOGIN_CALLBACK, LOGIN_EXAMPLE_CALLBACK } from "../services/login/buttons"


export const setUpHolaCommand = async (bot: Telegraf) => {
  bot.command(`start`, async (ctx: Context) => {
    const lastMessage = await ctx.reply(welcomeMessage, startInlineKeyboard)
    userState[ctx.from!.id] = { ...userState[ctx.from!.id], lastMessageId: lastMessage.message_id }
  })
  bot.action(LOGIN_CALLBACK, async (ctx: Context) => {
    await ctx.reply(LOGIN_REQUEST_NICKNAME_MESSAGE)
    userState[ctx.from!.id] = { stage: 'login_nickname' }
  })
  bot.action(SIGN_UP_CALLBACK, async (ctx: Context) => {
    await ctx.reply(LOGIN_REQUEST_NICKNAME_MESSAGE)
    userState[ctx.from!.id] = { stage: 'signUp_nickname' }
  })
  bot.action(LOGIN_EXAMPLE_CALLBACK, async (ctx: Context) => {
    await ctx.reply(LOGIN_EXAMPLE_INFO_MESSAGE)
  })
  bot.action(SIGN_UP_EXAMPLE_CALLBACK, async (ctx: Context) => {
    await ctx.reply(SING_UP_EXAMPLE_MESSAGE)
  })
  bot.action(`openAi_testing`, async (ctx: Context) => {
    userState[ctx.from!.id] = { stage: 'openai' }
  })
}


