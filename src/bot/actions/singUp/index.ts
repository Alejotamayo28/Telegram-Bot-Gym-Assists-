import { Context } from "telegraf"
import { bot } from "../../../telegram/bot"
import { userState } from "../../../userState"
import { sendMenuFunctions } from "../../../telegram/menus/userMenu"

bot.action('option_signUp', async (ctx: Context) => {
  await ctx.reply(`Por favor, proporciona tu nickname con el cual te gustaria entrar en la aplicacion `)
  userState[ctx.from!.id] = { stage: 'signUp_nickname' }
})
bot.action(`option_guide_signUp`, async (ctx: Context) => {
  await ctx.reply(`Al hacer clic en el botón "Crear cuenta", se te harán algunas preguntas sobre tu información personal. Por favor, lee cada pregunta cuidadosamente y responde de manera responsable. 
  Tus datos serán almacenados en una base de datos segura. Solo tu "nickname" y "email" serán visibles, mientras que tu contraseña estará encriptada para proteger tu privacidad. ¡Gracias por tu cooperación!`)
  await sendMenuFunctions(ctx)
})
