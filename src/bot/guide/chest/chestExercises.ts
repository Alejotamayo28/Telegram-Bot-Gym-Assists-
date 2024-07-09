import { Markup } from "telegraf"

//INCLINADO
export const inclinadoMancuernas = async (ctx: any) => {
  return ctx.reply(`cooming soon...`,
    Markup.inlineKeyboard([
      [Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)]
    ]))
}
export const inclinadoSmith = async (ctx: any) => {
  return ctx.reply(`cooming soon...`,
    Markup.inlineKeyboard([
      [Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)]
    ]))
}
export const inclinadoBarra = async (ctx: any) => {
  return ctx.reply(`cooming soon...`,
    Markup.inlineKeyboard([
      [Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)]
    ]))
}

//DECLINADO
export const declinadoMancuernas = async (ctx: any) => {
  return ctx.reply(`cooming son...`,
    Markup.inlineKeyboard([
      [Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)]
    ])
  )
}
export const declinadoSmith = async (ctx: any) => {
  return ctx.reply(`cooming son...`,
    Markup.inlineKeyboard([
      [Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)]
    ])
  )
}
export const declinadoBarra = async (ctx: any) => {
  return ctx.reply(`cooming son...`,
    Markup.inlineKeyboard([
      [Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)]
    ])
  )
}
//COMPLETO
export const pressPlano = async (ctx: any) => {
  return ctx.reply(`cooming soon...`,
    Markup.inlineKeyboard([
      Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)
    ])
  )
}
export const pressPlano_mancuernas = async (ctx: any) => {
  return ctx.reply(`cooming soon...`,
    Markup.inlineKeyboard([
      Markup.button.callback(`Menu ejercicios`, `menuExercises`), Markup.button.callback(`Menu principal`, `menu_principal`)
    ])
  )
}





