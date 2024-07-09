import { Markup } from "telegraf";

export const menuPecho = async (ctx: any) => {
  return ctx.reply(`Por favor, esocge la parte especifica del pecho que deseas trabajar: \n`,
    Markup.inlineKeyboard([
      [Markup.button.callback(`Pecho superior`, `menuPecho_superior`),
      Markup.button.callback(`Pecho inferior`, `menuPecho_inferior`)],
      [Markup.button.callback(`Pecho completo`, `menuPecho_completo`)]
    ])
  )
}

export const menuPecho_Superior = async (ctx: any) => {
  return ctx.reply(
    `Aqui tienes algunos ejercicios para el Pecho superior que puedes realizar:`,
    Markup.inlineKeyboard([
      [Markup.button.callback(`Inclinado mancuernas`, `inclinado_mancuernas`),
      Markup.button.callback(`Inclinado smith`, `inclinado_smith`)],
      [Markup.button.callback(`Inclinado barra`, `inclinado_barra`)],
      [Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)]
    ])
  )
}

export const menuPecho_inferior = async (ctx: any) => {
  return ctx.reply(
    `Aqui tienes algunos ejercicios para el Pecho inferior que puedes realizar:`,
    Markup.inlineKeyboard([
      [Markup.button.callback(`Declinado mancuernas`, `declinado_smith`), Markup.button.callback(`Declinado Smith`, `declinado_smith`)],
      [Markup.button.callback(`Decliando barra`, `declinado_barra`)]
    ])
  )
}

export const menuPecho_completo = async (ctx: any) => {
  return ctx.reply(
    `Aqui tienes algunos ejercicios para el Pecho Completo que puedes realizar: `,
    Markup.inlineKeyboard([
      [Markup.button.callback(`Press plano`, `press_plano`), Markup.button.callback(`Press plano mancuernas`, `press_plano_mancuernas`)]
    ])
  )
}
