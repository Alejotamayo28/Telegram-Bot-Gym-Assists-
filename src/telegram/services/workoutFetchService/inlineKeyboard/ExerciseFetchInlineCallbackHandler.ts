import { Context, Telegraf } from "telegraf";
import { ExerciseFetchFormatter } from "../../../../data-formatter.ts/exercise-fetch-formatter";
import { WorkoutQueryFetcher } from "../../../../database/queries/exerciseQueries";
import { updateUserStage, BotStage } from "../../../../userState";
import { botMessages } from "../../../messages";
import { MonthInlineKeybord } from "../../../utils/monthUtils/inlineKeyboard";
import { MonthCallbacks } from "../../../utils/monthUtils/models";
import { BotUtils } from "../../../../utils/botUtils";
import { mainMenuPage } from "../../menus/mainMenuHandler/mainMenuController";
import { setUpKeyboardIteration, regexPattern } from "../../utils";
import { dataLenghtEmpty } from "../../../../utils/responseUtils";

export class ExerciseViewCallbackHandler {
  constructor(private ctx: Context) { }
  async getLastWeekExercisesRecordCallback(bot: Telegraf) {
    const data = await WorkoutQueryFetcher.getExercisesFromLastWeekByUserId(
      this.ctx.from!.id,
    );
    if (!data.length) {
      return await dataLenghtEmpty(this.ctx, bot)
    }
    const mappedData = ExerciseFetchFormatter.formatExerciseByDay(
      data,
      "getMethod",
    );
    await BotUtils.sendBotMessage(this.ctx, mappedData);
    return await mainMenuPage(
      this.ctx,
      bot,
      botMessages.inputRequest.prompts.getMethod.succesfull,
    );
  }
  async handleGetExerciseRecordByMonthCallback(bot: Telegraf) {
    const monthKeyboard = new MonthInlineKeybord(
      botMessages.inputRequest.prompts.getMethod.exerciseMonth,
    );
    const getRecordController = async () => {
      await BotUtils.sendBotMessage(
        this.ctx,
        botMessages.inputRequest.prompts.getMethod.exerciseRecord,
      );
      return updateUserStage(
        this.ctx.from!.id,
        BotStage.Exercise.GET_ONE_EXERCISE_RECORD,
      );
    };
    await setUpKeyboardIteration(this.ctx, monthKeyboard, bot, {
      callbackPattern: regexPattern(MonthCallbacks),
      nextStep: async () => await getRecordController(),
    });
  }
}
