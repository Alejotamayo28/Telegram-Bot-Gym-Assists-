import { Markup } from "telegraf";

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


export const menuApiBrazo = async (ctx: any) => {
  return ctx.reply(`Por favor, escoge la parte especifica del brazo que deseas trabajar: \n`,
    Markup.inlineKeyboard([
      [Markup.button.callback(`Hombro`, `menuApiBrazo_hombro`), Markup.button.callback(`Biscep`, `menuApiBrazo_biscep`),
      Markup.button.callback(`Triscep`, `menuApiBrazo_triscep`)]
    ])
  )
}

export const menuApiBack = async (ctx: any) => {
  return ctx.reply(`Por favor, escoge la parte especifica de la espalda que deseas trabajar: \n`,
    Markup.inlineKeyboard([
      [Markup.button.callback(`Trapecio`, `menuBack_trapecio`), Markup.button.callback(`Espalda Alta`, `menuBack_espaldaAlta`)],
      [Markup.button.callback(`Dorsales`, `menuBack_dorsales`), Markup.button.callback(`Lumbar`, `menuBack_lumbar`)]
    ])
  )
}

export const menuApiLeg = async (ctx: any) => {
  return ctx.reply(`Por favor, escoge la parte especifica de la pierna que deseas trabajar: \n`,
    Markup.inlineKeyboard([
      [Markup.button.callback(`Gluteo`, `menuLeg_gluteo`), Markup.button.callback(`Cuadriceps`, `menuLeg_cuadricep`)],
      [Markup.button.callback(`Isquiostibiales`, `menuLeg_isquiotibial`), Markup.button.callback(`Femorales`, `menuLeg_femoral`)]
    ])
  )
}

