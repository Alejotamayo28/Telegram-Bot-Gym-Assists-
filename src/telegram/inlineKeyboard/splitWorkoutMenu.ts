import { Markup } from "telegraf";

export const splitWorkoutButtons = Markup.inlineKeyboard([
  [Markup.button.callback(`📚 `, " ")],
  [Markup.button.callback(``, "")]
])

export const splitsButton = Markup.inlineKeyboard([
  [
    Markup.button.callback(`💪🦵 `, ""),
    Markup.button.callback(``, "")
  ],
  [
    Markup.button.callback(`🔼🔽`, ""),
    Markup.button.callback(`🏆 `, "")
  ],
  [Markup.button.callback(`🦾 `, "")],
])


export const menuPrincipalSplits = Markup.inlineKeyboard([
  [Markup.button.callback(`Menu principal`, `menu_principal`),
  Markup.button.callback(`menu Split`, `splitWorkout`)]
])

