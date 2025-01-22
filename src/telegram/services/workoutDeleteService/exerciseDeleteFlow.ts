import { Context, Telegraf } from "telegraf";
import { MonthInlineKeybord } from "../../utils/monthUtils/inlineKeyboard";
import { botMessages } from "../../messages";
import { DaysInlineKeyboard } from "../../utils/daysUtils/inlineKeyboard";
import { WeekInlineKeybaord } from "../../utils/weekUtils/inlineKeyboard";
import { WorkoutQueryFetcher } from "../../../database/queries/exerciseQueries";
import { dataLenghtEmpty } from "../../../utils/responseUtils";
import { ExerciseFetchFormatter } from "../../../data-formatter.ts/exercise-fetch-formatter";
import { BotUtils } from "../../../utils/botUtils";
import { ExerciseSelectionInlineKeyboard } from "../../utils/exerciseUtils/ExerciseSelectionInlineKeyboard";
import { regexPattern, setUpKeyboardIteration } from "../utils";
import { MonthCallbacks } from "../../utils/monthUtils/models";
import { DaysCallbacks } from "../../utils/daysUtils/models";
import { WeekCallbacks } from "../../utils/weekUtils/models";

export const exerciseDeleteFlow = async (ctx: Context, bot: Telegraf) => {
  try {
    const monthKeyboard = new MonthInlineKeybord(
      botMessages.inputRequest.prompts.deleteMethod.exerciseMonth,
    );
    const daysKeyboard = new DaysInlineKeyboard(
      botMessages.inputRequest.prompts.deleteMethod.exerciseDay,
    );
    const weekKeyboard = new WeekInlineKeybaord(
      botMessages.inputRequest.prompts.deleteMethod.exerciseWeek,
    );
    const deleteExericiseCotroller = async () => {
      const data = await WorkoutQueryFetcher.getExerciseByMonthDayWeekAndUserId(
        ctx.from!.id,
      );
      if (!data.length) return await dataLenghtEmpty(ctx, bot);
      await BotUtils.sendBotMessage(
        ctx,
        ExerciseFetchFormatter.formatExerciseByNameDayAndWeek(
          data,
          ctx,
          "deleteMethod",
        ),
      );
      const exerciseKeyboard = new ExerciseSelectionInlineKeyboard(
        ctx,
        `deleteMethod`,
        botMessages.inputRequest.prompts.deleteMethod.selectExercisesToDeleteMessage,
        data,
      );
      await setUpKeyboardIteration(ctx, exerciseKeyboard, bot, {});
    };
    return await setUpKeyboardIteration(ctx, monthKeyboard, bot, {
      callbackPattern: regexPattern(MonthCallbacks),
      nextStep: async () =>
        await setUpKeyboardIteration(ctx, daysKeyboard, bot, {
          callbackPattern: regexPattern(DaysCallbacks),
          nextStep: async () =>
            await setUpKeyboardIteration(ctx, weekKeyboard, bot, {
              callbackPattern: regexPattern(WeekCallbacks),
              nextStep: async () => await deleteExericiseCotroller(),
            }),
        }),
    });
  } catch (error) {
    console.error(`Error: `, error);
  }
};
