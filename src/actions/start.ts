import { Markup } from "telegraf";
import { bot } from "../bot";

bot.start(async (ctx) => {
  await sendMainMenu(ctx)
});

export const sendMainMenu = async (ctx: any) => {
  return await ctx.reply(`¡Hola! Bienvenido a nuestro Asesor Virtual de entrenamiento y acondicionamiento físico.\n
Actualmente, estoy en la versión beta y planeo agregar mas funciones nuevas en el futuro. ¡Gracias por probarlo!\n
Por favor, selecciona una de las siguientes opciones para continuar:`, Markup.inlineKeyboard([
    Markup.button.callback('Iniciar sesión', 'option_login'),
    Markup.button.callback('Crear cuenta', 'option_signUp'),
  ])),
    await ctx.reply(`Si necesitas ayuda para iniciar sesión o crear una cuenta, selecciona una de las siguientes opciones:`,
      Markup.inlineKeyboard([
        Markup.button.callback('Guia para inicar session', 'option_guide_login'),
        Markup.button.callback('Ejemplo crear cuenta', 'option_guide_signUp')
      ]));
}


export const sendMainMenuOptions = async (ctx: any) => {
  return await ctx.reply(`Sigue explorando y utilizando las demas funciones de nuestro asistente virutal: \n`, Markup.inlineKeyboard([
    [Markup.button.callback('Iniciar sesión', 'option_login'), Markup.button.callback('Crear cuenta', 'option_signUp')],
    [Markup.button.callback('Guia para inicar session', 'option_guide_login'), Markup.button.callback('Ejemplo crear cuenta', 'option_guide_signUp')]
    ,])
  )
}

