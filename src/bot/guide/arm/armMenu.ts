import { Markup } from "telegraf"
import { bot } from "../../../routes"

export const armMenu = async (ctx: any) => {
  return ctx.reply(`Por favor, escoge la parte del cuerpo la cual deseas trabajar: \n`,
    Markup.inlineKeyboard([
      [Markup.button.callback(`Brazo`, `menu_api_brazo`), Markup.button.callback(`Pecho`, `menu_api_pecho`), Markup.button.callback(`Espalda`, `menu_api_espalda`)],
      [Markup.button.callback(`Pierna`, `menu_api_pierna`)]
    ])
  )
}

