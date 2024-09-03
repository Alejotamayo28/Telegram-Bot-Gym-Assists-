import { Context, Telegraf } from "telegraf";
import { UserStateManager } from "../../../userState";
import { userStateData } from "../../../model/client";
import { verifySignUpOutput } from "../../../bot/functions";
import { inlineKeyboardVerifySignUp } from "./inlineKeyboard";
import { startInlineKeyboard } from "../../commands/inlineKeyboard";
import { pool } from "../../../database/database";

export const signUpVerificationMenu = async (bot: Telegraf, ctx: Context, passwordHash: string) => {
  const userManager = new UserStateManager<userStateData>(ctx.from!.id)
  const { nickname, password, email } = userManager.getUserData()
  await ctx.reply(verifySignUpOutput({ nickname, password, email }),
    {
      parse_mode: 'MarkdownV2',
      ...inlineKeyboardVerifySignUp
    })
  bot.action(`si`, async (ctx: Context) => {
    await ctx.deleteMessage()
    await pool.query(
      `INSERT INTO client (id, nickname, password, email) VALUES ($1, $2, $3, $4)`,
      [ctx.from!.id, nickname, passwordHash, email]
    );
    ctx.reply(
      `*¡Cuenta creada con éxito\\!* 🎉\n\n_¿Sigue explorando, qué te gustaría hacer ahora?_`,
      {
        parse_mode: 'MarkdownV2',
        ...startInlineKeyboard
      }
    )
  })
  bot.action(`no`, async (ctx: Context) => {
    await ctx.deleteMessage()
    await ctx.reply(`*¡Usuario no creado\\!* 🤕\n\n_¿Sigue explorando, qué te gustaría hacer ahora?_`,
      {
        parse_mode: 'MarkdownV2',
        ...startInlineKeyboard
      })
  })
}
