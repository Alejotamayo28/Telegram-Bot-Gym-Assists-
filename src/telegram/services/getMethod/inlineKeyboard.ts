import { Context, Telegraf } from "telegraf";
import { BotStage, deleteBotMessage, updateUserStage } from "../../../userState";
import { EXERCISE_VIEW_LABELS, ExerciseFetchGraphTextLabels, ExerciseFetchGraphTextOptions, ExerciseViewOption } from "./models";
import { msgExerciseViewOptionsMD } from "./messages";
import { InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram";
import { handleGetDailyExercisesGraphic } from ".";
import { ExerciseQueryFetcher } from "./queries";
import { MessageTemplate } from "../../../template/message";
import { mainMenuPage } from "../../mainMenu";
import { ExerciseGetHandler, ExerciseGetUtils } from "./functions";
import { BotUtils } from "../singUp/functions";
import { botMessages } from "../../messages";
import { MonthInlineKeybord } from "../../utils/monthUtils/inlineKeyboard";
import { regexPattern, setUpKeyboardIteration } from "../utils";
import { MonthCallbacks } from "../../utils/monthUtils/models";

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
    if (!data.length) {
      return await mainMenuPage(ctx, bot,
        botMessages.inputRequest.prompts.getMethod.errors.exerciseEmptyData)
    }
    const mappedData = ExerciseGetUtils.mapExercisesByDay(data, "getMethod")
    await BotUtils.sendBotMessage(ctx, mappedData)
    return await mainMenuPage(ctx, bot, botMessages.inputRequest.prompts.getMethod.succesfull)
  }

  //Flow: Mes -> nombre ejercicio
  private async handleOneRecord(ctx: Context, bot: Telegraf) {
    const monthKeyboard = new MonthInlineKeybord(
      botMessages.inputRequest.prompts.getMethod.exerciseMonth)
    const getRecordController = async () => {
      await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.prompts.getMethod.exerciseRecord)
      return updateUserStage(ctx.from!.id, BotStage.Exercise.GET_ONE_EXERCISE_RECORD)
    }

    await setUpKeyboardIteration(ctx, monthKeyboard, bot, {
      callbackPattern: regexPattern(MonthCallbacks),
      nextStep: async () => await getRecordController()
    })
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









