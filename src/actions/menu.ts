import { Markup } from "telegraf"
import { bot } from "../bot"


bot.action(`menuExercises`, async (ctx) => {
    await sendMenupApi(ctx)
})

bot.action(`menu_principal`, async (ctx) => {
    await sendMenuOptions(ctx)
})

export const sendMenu = async (ctx: any) => {
  return ctx.reply(`¡Hola! Bienvenido al menú de usuario.

En este menú encontrarás varias funciones que pueden ajustarse a tus necesidades. Siéntete libre de explorar y utilizar todas las opciones disponibles.

Actualmente, estamos en la versión beta, y planeo agregar muchas más funciones en el futuro. ¡Gracias por probarlo!`,
    Markup.inlineKeyboard([
      [Markup.button.callback('Agregar ejercicio', 'menu_post_exercise'), Markup.button.callback('Actualizar ejercicio', 'menu_put_exercise')],
      [Markup.button.callback('Obtener ejercicio por día', 'menu_get_exercise_day'), Markup.button.callback('Obtener ejercicios semanales', 'menu_get_exercise')],
      [Markup.button.callback('Eliminar ejercicio', 'menu_delete_exercise')],
      [Markup.button.callback(`Guia ejercicios`, `menuExercises`)]
    ])
  );
};

export const sendMenuOptions = async (ctx: any) => {
  return ctx.reply(`Sigue explorando y utilizando las demas funciones de nuestro asistente virutal: \n`,
    Markup.inlineKeyboard([
      [Markup.button.callback('Agregar ejercicio', 'menu_post_exercise'), Markup.button.callback('Actualizar ejercicio', 'menu_put_exercise')],
      [Markup.button.callback('Obtener ejercicio por día', 'menu_get_exercise_day'), Markup.button.callback('Obtener ejercicios semanales', 'menu_get_exercise')],
      [Markup.button.callback('Eliminar ejercicio', 'menu_delete_exercise')],
      [Markup.button.callback(`Guia ejercicios`, `menuExercises`)],
    ])
  );
};

export const sendMenupApi = async (ctx: any) => {
  return ctx.reply(`Por favor, escoge la parte del cuerpo la cual deseas trabajar: \n`,
    Markup.inlineKeyboard([
      [Markup.button.callback(`Brazo`, `Brazo`), Markup.button.callback(`Pecho`, `Pecho`), Markup.button.callback(`Espalda`, `Espalda`)],
      [Markup.button.callback(`Pierna`, `menuPierna`)]
    ])
  )
}


