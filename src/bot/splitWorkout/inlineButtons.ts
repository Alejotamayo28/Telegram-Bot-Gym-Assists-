import { Markup } from "telegraf";


export const splitWorkoutButtons = Markup.inlineKeyboard([
  [Markup.button.callback(`Que es un split?`, `definicion`)],
  [Markup.button.callback(`Recomendaciones Split Semanales`, `recomendaciones`)]]
)

export const splitsButton = Markup.inlineKeyboard([
  [Markup.button.callback(`Push/Pull/Legs`, `pushPullLegs`), Markup.button.callback(`Full Body`, `fullBody`)],
  [Markup.button.callback(`Upper/Lower`, `upperLower`), Markup.button.callback(`Arnold's Split`, `arnoldsSplit`)],
  [Markup.button.callback(`Bro Split`, `broSplit`)]
])

export const menuPrincipalSplits = Markup.inlineKeyboard([
  [Markup.button.callback(`Menu principal`, `menu_principal`), Markup.button.callback(`menu Split`, `splitWorkout`)]
])
