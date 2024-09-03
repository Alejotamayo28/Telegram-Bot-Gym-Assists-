import { Markup } from "telegraf";

export const inlineKeyboardVerifySignUp = Markup.inlineKeyboard([
  [Markup.button.callback(`Crear cuenta`, `si`),
  Markup.button.callback(`No crear cuenta`, `no`)]
])
