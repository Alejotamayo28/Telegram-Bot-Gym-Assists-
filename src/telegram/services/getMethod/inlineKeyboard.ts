import { Context, Telegraf } from "telegraf";
import { saveBotMessage, userStageGetExercise, userStateUpdateStage } from "../../../userState";
import { EXERCISE_VIEW_LABELS, ExerciseFetchGraphTextLabels, ExerciseFetchGraphTextOptions, ExerciseViewOption } from "./models";
import { msgExerciseViewOptionsMD } from "./messages";
import { InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram";
import { EXERCISE_INTERVALS_LABELS, ExerciseIntervalOption, fetchExerciseIntervalController, handleGetDailyExercisesGraphic, handleGetDailyExercisesText, handleGetWeeklyExercises } from ".";
import { ExerciseQueryFetcher } from "./queries";
import { GET_EXERCISE_DAY_OUTPUT } from "../../mainMenu/messages";
import { MessageTemplate } from "../../../template/message";
import { redirectToMainMenuWithTaskDone } from "../../mainMenu";

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
    await ctx.deleteMessage(message.message_id)
    const handlers: { [key: string]: () => Promise<void> } = {
      [ExerciseViewOption.DAILY]: this.handleDailyCallback.bind(this, ctx, bot),
      [ExerciseViewOption.WEEKLY]: this.handleWeeklyCallback.bind(this, ctx, bot),
      [ExerciseViewOption.INTERVAL]: this.handleIntervalCallback.bind(this, ctx, bot)
    };
    if (handlers[action]) {
      return handlers[action]();
    }
  }
  private async handleDailyCallback(ctx: Context, bot: Telegraf) {
    const response = await ctx.reply(GET_EXERCISE_DAY_OUTPUT, {
      parse_mode: "MarkdownV2"
    })
    saveBotMessage(ctx, response.message_id)
    userStateUpdateStage(ctx, userStageGetExercise.GET_EXERCISE_OPTIONS)
  }
  private async handleWeeklyCallback(ctx: Context, bot: Telegraf) {
    await handleGetWeeklyExercises(ctx)
    await redirectToMainMenuWithTaskDone(ctx, bot)
  }
  private async handleIntervalCallback(ctx: Context, bot: Telegraf) {
    await fetchExerciseIntervalController(ctx, bot)
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
      `📅 * Aquí están tus ejercicios de las últimas 3 semanas: *\n\nSelecciona una semana para ver los detalles: `
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(EXERCISE_INTERVALS_LABELS.SEMANA_1, { action: ExerciseIntervalOption.WEEK_1 }),
          this.createButton(EXERCISE_INTERVALS_LABELS.SEMANA_2, { action: ExerciseIntervalOption.WEEK_2 })],
        [
          this.createButton(EXERCISE_INTERVALS_LABELS.SEMANA_3, { action: ExerciseIntervalOption.WEEK_3 })
        ]
      ],
    }; return { message, keyboard }
  }
  async handleOptions(ctx: Context, message: Message, action: string, bot: Telegraf) {
    await ctx.deleteMessage(message.message_id)
    const handlers: { [key: string]: () => Promise<any> } = {
      [ExerciseIntervalOption.WEEK_1]: this.handleWeek1Callback.bind(this, ctx),
      [ExerciseIntervalOption.WEEK_2]: this.handleWeek2Callback.bind(this, ctx),
      [ExerciseIntervalOption.WEEK_3]: this.handleWeek3Callback.bind(this, ctx)
    };
    if (handlers[action]) {
      return handlers[action]();
    }
  }
  private async handleWeek1Callback(ctx: Context) {
    await ExerciseQueryFetcher.ExerciseIntervalFirtsWeek(ctx)
  }
  private async handleWeek2Callback(ctx: Context) {
    await ExerciseQueryFetcher.ExeriseIntervalSecondWeek(ctx)
  }
  private async handleWeek3Callback(ctx: Context) {
    await ExerciseQueryFetcher.ExeriseIntervalThirdWeek(ctx)
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
      [ExerciseFetchGraphTextOptions.TEXT]: this.handleTextCallback.bind(this, ctx, userMessage, bot),
      [ExerciseFetchGraphTextOptions.GRAPHIC]: this.handleGraphicCallback.bind(this, ctx, userMessage, bot)
    };
    if (handlers[action]) {
      return handlers[action]();
    }
  }
  private async handleTextCallback(ctx: Context, userMessage: string, bot: Telegraf) {
    await handleGetDailyExercisesText(ctx, userMessage, bot)
  }
  private async handleGraphicCallback(ctx: Context, userMessage: string, bot: Telegraf) {
    await handleGetDailyExercisesGraphic(ctx, userMessage, bot)
  }
}









