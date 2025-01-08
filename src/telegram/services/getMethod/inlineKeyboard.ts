import { Context, Telegraf } from "telegraf";
import { deleteBotMessage, userStageGetExercise, userStateUpdateStage } from "../../../userState";
import { EXERCISE_VIEW_LABELS, ExerciseFetchGraphTextLabels, ExerciseFetchGraphTextOptions, ExerciseViewOption } from "./models";
import { msgExerciseViewOptionsMD } from "./messages";
import { InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram";
import { EXERCISE_INTERVALS_LABELS, ExerciseIntervalOption, handleGetDailyExercisesGraphic } from ".";
import { ExerciseQueryFetcher } from "./queries";
import { MessageTemplate } from "../../../template/message";
import { redirectToMainMenuWithTaskDone } from "../../mainMenu";
import { ExerciseGetHandler, ExerciseGetUtils } from "./functions";
import { BotUtils } from "../singUp/functions";
import { botMessages } from "../../messages";
import { MonthInlineKeybord } from "../../utils/monthUtils/inlineKeyboard";
import { handleKeyboardStep, regexPattern } from "../utils";
import { MonthCallbacks } from "../../utils/monthUtils/models";

// Cambiar, 1) Semana pasada
//          2) Seguimiento de un ejercicio
export class ExerciseFetchHandler extends MessageTemplate {
  protected prepareMessage() {
    const message = msgExerciseViewOptionsMD;
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(EXERCISE_VIEW_LABELS.lastWeek, { action: ExerciseViewOption.lastWeek }),
          this.createButton(EXERCISE_VIEW_LABELS.oneExercise, { action: ExerciseViewOption.oneExercise })
        ],
      ],
    };
    return { message, keyboard };
  }
  async handleOptions(ctx: Context, message: Message, action: string, bot: Telegraf) {
    await deleteBotMessage(ctx)
    const handlers: { [key: string]: () => Promise<void> } = {
      [ExerciseViewOption.lastWeek]: this.handleLastWeek.bind(this, ctx, bot),
      [ExerciseViewOption.oneExercise]: this.handleOneRecord.bind(this, ctx, bot)
    };
    if (handlers[action]) {
      return handlers[action]();
    }
  }
  private async handleLastWeek(ctx: Context, bot: Telegraf) {
    const data = await ExerciseQueryFetcher.ExcerciseLastWeekById(ctx)
    const mappedData = ExerciseGetUtils.mapExercisesByDay(data, "getMethod")
    await BotUtils.sendBotMessage(ctx, mappedData)
    await redirectToMainMenuWithTaskDone(ctx, bot, botMessages.inputRequest.prompts.getMethod.succesfull)
  }
  //Mes -> nombre ejercicio
  private async handleOneRecord(ctx: Context, bot: Telegraf) {
    const monthKeyboard = new MonthInlineKeybord(
      botMessages.inputRequest.prompts.getMethod.exerciseMonth)
    const getRecordController = async () => {
      await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.prompts.getMethod.exerciseRecord)
      userStateUpdateStage(ctx, userStageGetExercise.GET_EXERCISE_RECORD)
    }
    await handleKeyboardStep(ctx, monthKeyboard, bot, regexPattern(MonthCallbacks), getRecordController)
  }
}

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
    await deleteBotMessage(ctx)
    const handlers: { [key: string]: () => Promise<any> } = {
      [ExerciseIntervalOption.WEEK_1]: this.handleWeek1Callback.bind(this, ctx, bot),
      [ExerciseIntervalOption.WEEK_2]: this.handleWeek2Callback.bind(this, ctx, bot),
      [ExerciseIntervalOption.WEEK_3]: this.handleWeek3Callback.bind(this, ctx, bot)
    };
    if (handlers[action]) {
      return handlers[action]();
    }
  }
  private async handleWeek1Callback(ctx: Context, bot: Telegraf): Promise<void> {
    const exercises = await ExerciseQueryFetcher.ExerciseIntervalFirtsWeek(ctx)
    return await redirectToMainMenuWithTaskDone(ctx, bot,
      `Ejercicios obtenidos exitosamente.`)
  }
  private async handleWeek2Callback(ctx: Context, bot: Telegraf) {
    const exercises = await ExerciseQueryFetcher.ExeriseIntervalSecondWeek(ctx)
    return await redirectToMainMenuWithTaskDone(ctx, bot,
      `Ejercicios obtenidos exitosamente.`)
  }
  private async handleWeek3Callback(ctx: Context, bot: Telegraf) {
    const exercises = await ExerciseQueryFetcher.ExeriseIntervalThirdWeek(ctx)
    return await redirectToMainMenuWithTaskDone(ctx, bot,
      `Ejercicios obtenidos exitosamente.`)
  }
}

export class ExerciseFetchHandlerOptions extends MessageTemplate {
  protected prepareMessage() {
    const message = `_Como te gustaria obtener tus resultados_:`
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
    await deleteBotMessage(ctx)
    const handlers: { [key: string]: () => Promise<any> } = {
      [ExerciseFetchGraphTextOptions.TEXT]: this.handleTextCallback.bind(this, ctx, userMessage, bot),
      [ExerciseFetchGraphTextOptions.GRAPHIC]: this.handleGraphicCallback.bind(this, ctx, userMessage, bot)
    };
    if (handlers[action]) {
      return handlers[action]();
    }
  } private async handleTextCallback(ctx: Context, userMessage: string, bot: Telegraf) {
    await ExerciseGetHandler.getDailyExerciseText(ctx, userMessage, bot)
  }
  private async handleGraphicCallback(ctx: Context, userMessage: string, bot: Telegraf) {
    await handleGetDailyExercisesGraphic(ctx, userMessage, bot)
  }
}









