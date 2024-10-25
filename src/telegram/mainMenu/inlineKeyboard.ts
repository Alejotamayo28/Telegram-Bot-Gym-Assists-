import { Context, Markup } from 'telegraf';
import { DELETE_EXERCISE_BUTTON, DELETE_EXERCISE_CALLBACK, GET_EXERCISE_DAY_BUTTON, GET_EXERCISE_DAY_CALLBACK, GET_EXERCISE_WEEK_BUTTON, GET_EXERCISE_WEEK_CALLBACK, POST_EXERCISE_BUTTON, POST_EXERCISE_CALLBACK, UPDATE_EXERCISE_BUTTON, UPDATE_EXERCISE_CALLBACK } from '../mainMenu/buttons';

export const inlineKeyboardMenu = Markup.inlineKeyboard([
  [
    Markup.button.callback(`📝 ${POST_EXERCISE_BUTTON}`, POST_EXERCISE_CALLBACK),
    Markup.button.callback(`🔄 ${UPDATE_EXERCISE_BUTTON}`, UPDATE_EXERCISE_CALLBACK)
  ],
  [
    Markup.button.callback(`📅 ${GET_EXERCISE_DAY_BUTTON}`, GET_EXERCISE_DAY_CALLBACK),
    Markup.button.callback(`📆 ${GET_EXERCISE_WEEK_BUTTON}`, GET_EXERCISE_WEEK_CALLBACK)
  ],
  [Markup.button.callback(`🗑️ ${DELETE_EXERCISE_BUTTON}`, DELETE_EXERCISE_CALLBACK)],
])



//EJEMPLO
/*
export const TESTreplyKeyboard = () => {
  return {
    reply_markup: {
      keyboard: [
        ['Opción 1', 'Opción 2'],
        ['Opción 3', 'Opción 4']
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  }
}

export const TEST = async (ctx: Context) => {
  await ctx.reply(`elige una opcion: `, TESTreplyKeyboard())
}
*/
