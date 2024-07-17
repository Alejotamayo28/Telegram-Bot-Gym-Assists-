import { Markup } from "telegraf";

export const buttonGuideMenuExercisesPrincipal = Markup.inlineKeyboard([
  [Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)]
])

export const buttonLogin = Markup.inlineKeyboard([
  Markup.button.callback(`Inicar seccion`, `option_login`)
])

export const buttonMenu = Markup.inlineKeyboard([
  [Markup.button.callback('Agregar ejercicio', 'menu_post_exercise'), Markup.button.callback('Actualizar ejercicio', 'menu_put_exercise')],
  [Markup.button.callback('Obtener ejercicio por día', 'menu_get_exercise_day'), Markup.button.callback('Obtener ejercicios semanales', 'menu_get_exercise')],
  [Markup.button.callback('Eliminar ejercicio', 'menu_delete_exercise')],
  [Markup.button.callback(`Guia ejercicios`, `menuExercises`), Markup.button.callback(`Split Semanal`, `splitSemanal`)],
])
