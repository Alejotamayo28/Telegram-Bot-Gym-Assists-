import { Markup } from "telegraf";

export const inlineKeyboardGetDailyExercicses = Markup.inlineKeyboard([
  [Markup.button.callback(`📝 Grafico `, 'grafico')],
  [Markup.button.callback(`🔄 Texto`, 'texto')]
])
