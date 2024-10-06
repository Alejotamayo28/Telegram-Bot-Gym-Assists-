import { Context, Telegraf } from "telegraf"
import { welcomeMessage } from "../messages/welcomeMessage"
import { userState } from "../../userState"
import { startInlineKeyboard } from "./inlineKeyboard"
import { SIGN_UP_CALLBACK, SIGN_UP_EXAMPLE_CALLBACK } from "../services/singUp/buttons"
import { SIGN_UP_NICKNAME, SING_UP_EXAMPLE_MESSAGE } from "../services/singUp/message"
import { LOGIN_CALLBACK, LOGIN_EXAMPLE_CALLBACK } from "../services/login/buttons"
import { LOGIN_EXAMPLE_INFO_MESSAGE, LOGIN_REQUEST_NICKNAME_MESSAGE } from "../services/login/messages"

export const setUpHolaCommand = async (bot: Telegraf) => {
  bot.command(`start`, async (ctx: Context) => {
    const lastMessage = await ctx.reply(welcomeMessage, {
      parse_mode: "Markdown",
      reply_markup: startInlineKeyboard.reply_markup
    })
    userState[ctx.from!.id] = { ...userState[ctx.from!.id], lastMessageId: lastMessage.message_id }
  })
  bot.action(LOGIN_CALLBACK, async (ctx: Context) => {
    await ctx.reply(LOGIN_REQUEST_NICKNAME_MESSAGE, {
      parse_mode: "Markdown",
    })
    userState[ctx.from!.id] = { stage: 'login_nickname' }
  })
  bot.action(SIGN_UP_CALLBACK, async (ctx: Context) => {
    await ctx.reply(SIGN_UP_NICKNAME, {
      parse_mode: "Markdown"
    })
    userState[ctx.from!.id] = { stage: 'signUp_nickname' }
  })
  bot.action(LOGIN_EXAMPLE_CALLBACK, async (ctx: Context) => {
    await ctx.deleteMessage()
    await ctx.reply(LOGIN_EXAMPLE_INFO_MESSAGE, {
      parse_mode: "Markdown",
      reply_markup: startInlineKeyboard.reply_markup
    })
  })
  bot.action(SIGN_UP_EXAMPLE_CALLBACK, async (ctx: Context) => {
    await ctx.deleteMessage()
    await ctx.reply(SING_UP_EXAMPLE_MESSAGE, {
      parse_mode: "Markdown",
      reply_markup: startInlineKeyboard.reply_markup
    })
  })
}


