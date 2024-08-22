import { Markup } from "telegraf";

export const buttonGuideMenuExercisesPrincipal = Markup.inlineKeyboard([
  [Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)]
])

export const buttonLogin = Markup.inlineKeyboard([
  Markup.button.callback(`Inicar seccion`, `option_login`)
])

