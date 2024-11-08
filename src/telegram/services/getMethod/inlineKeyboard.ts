import { Context, Markup, Telegraf } from "telegraf";
import { userStageGetExercise, userStateUpdateStage } from "../../../userState";
import { EXERCISE_VIEW_LABELS, ExerciseFetchGraphTextLabels, ExerciseFetchGraphTextOptions, ExerciseViewOption } from "./models";
import { msgExerciseViewOptionsMD } from "./messages";
import { InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram";
import { EXERCISE_INTERVALS_LABELS, ExerciseIntervalOption, fetchExerciseIntervalController, handleGetDailyExercisesGraphic, handleGetDailyExercisesText, handleGetWeeklyExercises } from ".";
import { ExerciseQueryFetcher } from "./queries";
import { sendMenuFunctions } from "../../menus/userMenu";
import { GET_EXERCISE_DAY_OUTPUT } from "../../mainMenu/messages";
import { MessageTemplate } from "../../../template/message";

/**
 * ExerciseFetchHandler, allows the user to choose how to receive their exercise results
 * When active it displays options to get results at specific options:
 * 'Diario', 'Semanal', 'Intervalo'.
 */
export class ExerciseFetchHandler extends MessageTemplate {
  protected prepareMessage() {
    const message = msgExerciseViewOptionsMD;
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(EXERCISE_VIEW_LABELS.DAILY, { action: ExerciseViewOption.DAILY }),
          this.createButton(EXERCISE_VIEW_LABELS.WEEKLY, { action: ExerciseViewOption.WEEKLY })
        ],
        [
          this.createButton(EXERCISE_VIEW_LABELS.INTERVAL, { action: ExerciseViewOption.INTERVAL })
        ]
      ],
    };
    return { message, keyboard };
  }
  async handleOptions(ctx: Context, message: Message, action: string, bot: Telegraf) {
    const handlers: { [key: string]: () => Promise<void> } = {
      [ExerciseViewOption.DAILY]: async () => {
        await ctx.deleteMessage(message.message_id)
        await ctx.reply(GET_EXERCISE_DAY_OUTPUT, { parse_mode: "MarkdownV2" })
        userStateUpdateStage(ctx, userStageGetExercise.GET_EXERCISE_OPTIONS);
      },
      [ExerciseViewOption.WEEKLY]: async () => {
        await ctx.deleteMessage(message.message_id)
        await handleGetWeeklyExercises(ctx)
        await sendMenuFunctions(ctx)
      },
      [ExerciseViewOption.INTERVAL]: async () => {
        await ctx.deleteMessage(message.message_id)
        await fetchExerciseIntervalController(ctx, bot)
      }
    };
    if (handlers[action]) {
      return handlers[action]();
    }
  }
}

/**
 * ExerciseFetchHandlerInterval, allows the user to choose the desire interval to obtain their exercises
 * When active it displays options to get results at specific weeks
 * 'Semana 1', 'Semana 2', 'Semana 3'.
 */
export class ExerciseFetchHandlerInterval extends MessageTemplate {
  protected prepareMessage() {
    const message =
      `📅 *Aquí están tus ejercicios de las últimas 3 semanas: *\n\nSelecciona una semana para ver los detalles:`
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(EXERCISE_INTERVALS_LABELS.SEMANA_1, { action: ExerciseIntervalOption.WEEK_1 }),
          this.createButton(EXERCISE_INTERVALS_LABELS.SEMANA_2, { action: ExerciseIntervalOption.WEEK_2 })],
        [
          this.createButton(EXERCISE_INTERVALS_LABELS.SEMANA_3, { action: ExerciseIntervalOption.WEEK_3 })
        ]
      ],
    };
    return { message, keyboard }
  }
  async handleOptions(ctx: Context, message: Message, action: string, bot: Telegraf) {
    const handlers: { [key: string]: () => Promise<any> } = {
      [ExerciseIntervalOption.WEEK_1]: async () => {
        await ctx.deleteMessage(message.message_id)
        const response = await ExerciseQueryFetcher.ExerciseIntervalFirtsWeek(ctx)

      },
      [ExerciseIntervalOption.WEEK_2]: async () => {
        await ctx.deleteMessage(message.message_id);
        const response = await ExerciseQueryFetcher.ExeriseIntervalSecondWeek(ctx)
      },
      [ExerciseIntervalOption.WEEK_3]: async () => {
        await ctx.deleteMessage(message.message_id);
        const response = await ExerciseQueryFetcher.ExeriseIntervalThirdWeek(ctx)
      }
    };
    if (handlers[action]) {
      return handlers[action]();
    }
  }
}

/**
* ExerciseFetchHandlerOptions, allows the user to choose how to display their exercise result
 * When active, it displays option for the user to choose beetween some options
 * 'Grafico', 'Textual'
 */
export class ExerciseFetchHandlerOptions extends MessageTemplate {
  protected prepareMessage() {
    const message = `Como te gustaria ver tus resultado`
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(ExerciseFetchGraphTextLabels.GRAPHIC, {
            action: ExerciseFetchGraphTextOptions.GRAPHIC
          }),
          this.createButton(ExerciseFetchGraphTextLabels.TEXT, {
            action: ExerciseFetchGraphTextOptions.TEXT
          })
        ],
      ]
    }
    return { message, keyboard }
  }
  async handleOptions(ctx: Context, message: Message, action: string, bot: Telegraf, userMessage: string) {
    const handlers: { [key: string]: () => Promise<any> } = {
      [ExerciseFetchGraphTextOptions.TEXT]: async () => {
        await handleGetDailyExercisesText(ctx, userMessage)
      },
      [ExerciseFetchGraphTextOptions.GRAPHIC]: async () => {
        console.log(`entro`)
        await handleGetDailyExercisesGraphic(ctx, userMessage)
      },
    };
    if (handlers[action]) {
      return handlers[action]();
    }
  }
}


//TECLADO inlineKeyboard  

export const inlineKeyboardGetDailyExercicses = Markup.inlineKeyboard([
  [Markup.button.callback(`📝 Grafico `, 'grafico')],
  [Markup.button.callback(`🔄 Texto`, 'texto')]
])

export const inlineKeyboardGetMenu = Markup.inlineKeyboard([
  [Markup.button.callback(`Intervalo`, `intervaloOption`)]
])

export const testingGet = async (ctx: Context, bot: Telegraf) => {
  await ctx.reply(`intervalo testing futures --testing--`, {
    reply_markup: inlineKeyboardGetMenu.reply_markup
  })
  bot.action(`intervaloOption`, async (ctx: Context) => {
    await ctx.reply(`Escribe el dia del intervalo`, {
      parse_mode: "Markdown"
    })
    userStateUpdateStage(ctx, `getOptions`)
  })
}



