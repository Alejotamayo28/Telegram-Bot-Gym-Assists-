import { Markup } from "telegraf";

export const inlineKeyboardVerifyDeleteExercise = Markup.inlineKeyboard([
  [Markup.button.callback(`Eliminar ejercicio`, `eliminar_si`),
  Markup.button.callback(`No eliminar ejercicio`, `eliminar_no`)]])
