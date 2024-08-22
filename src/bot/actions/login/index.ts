import { Context } from "telegraf";
import { userState } from "../../../userState";
import { bot } from "../../../telegram/bot";
import { sendMenuFunctions } from "../../../telegram/menus/userMenu";


bot.action('option_login', async (ctx: Context) => {
  await ctx.reply(`Por favor, digita tu nickname: `)
  userState[ctx.from!.id] = { stage: 'login_nickname' }
});

bot.action(`option_guide_login`, async (ctx: Context) => {
  await ctx.reply(`Al hacer click en el boton "Iniciar session", se te haran dos preguntas sobre tu cuenta. Por favor, lee cada pregunta cuidadosamente`)
  await sendMenuFunctions(ctx)
})
