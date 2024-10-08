import { Context, Telegraf } from "telegraf";
import { UserStateManager } from "../../../userState";
import { verifySignUpOutput } from "../utils";
import { inlineKeyboardVerifySignUp } from "./inlineKeyboard";
import { startInlineKeyboard } from "../../commands/inlineKeyboard";
import { SIGN_UP_NOT_SUCCESFULLY, SIGN_UP_SUCCESFULLY } from "./message";
import { onTransaction } from "../../../database/dataAccessLayer";
import { insertClientQuery } from "./queries";

export const signUpVerificationMenu = async (bot: Telegraf, ctx: Context, passwordHash: string) => {
  const userManager = new UserStateManager(ctx.from!.id)
  const { nickname, password, email } = userManager.getUserProfile()
  await ctx.reply(SIGN_UP_SUCCESFULLY,
    {
      parse_mode: "Markdown"
    })
  await ctx.reply(verifySignUpOutput({ nickname, password, email }),
    {
      parse_mode: 'MarkdownV2',
      ...inlineKeyboardVerifySignUp
    })
  bot.action(`si`, async (ctx: Context) => {
    await ctx.deleteMessage()
    await onTransaction(async (transactionClient) => {
      await insertClientQuery(ctx, { nickname, email }, passwordHash, transactionClient)
    })
    await ctx.reply(SIGN_UP_SUCCESFULLY, {
      parse_mode: 'MarkdownV2',
      ...startInlineKeyboard
    }
    )
  })
  bot.action(`no`, async (ctx: Context) => {
    await ctx.deleteMessage()
    await ctx.reply(SIGN_UP_NOT_SUCCESFULLY, {
      parse_mode: 'MarkdownV2',
      ...startInlineKeyboard
    })
  })
}
