import { Context, Markup } from "telegraf"

export const guideExercisesMenu = async (ctx: Context) => {
  return ctx.reply(`Por favor, escoge la parte del cuerpo la cual deseas trabajar: \n`,
    Markup.inlineKeyboard([
      [Markup.button.callback(`💪🏻 Brazo`, `Brazo`), Markup.button.callback(`🏋 Pecho`, `Pecho`),
      Markup.button.callback(`🤸🏻‍♀️ Espalda`, `Espalda`)],
      [Markup.button.callback(`🦵🏻 Pierna`, `Pierna`)]
    ])
  )
}
