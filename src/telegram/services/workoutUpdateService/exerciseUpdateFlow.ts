import { Context, Telegraf } from "telegraf";
import { ExerciseFetchFormatter } from "../../../data-formatter.ts/exercise-fetch-formatter";
import { WorkoutQueryFetcher } from "../../../database/queries/exerciseQueries";
import { botMessages } from "../../messages";
import { DaysInlineKeyboard } from "../../utils/daysUtils/inlineKeyboard";
import { DaysCallbacks } from "../../utils/daysUtils/models";
import { ExerciseSelectionInlineKeyboard } from "../../utils/exerciseUtils/ExerciseSelectionInlineKeyboard";
import { MonthInlineKeybord } from "../../utils/monthUtils/inlineKeyboard";
import { MonthCallbacks } from "../../utils/monthUtils/models";
import { WeekInlineKeybaord } from "../../utils/weekUtils/inlineKeyboard";
import { WeekCallbacks } from "../../utils/weekUtils/models";
import { regexPattern, setUpKeyboardIteration } from "../utils";

export const exerciseUpdateFlow = async (ctx: Context, bot: Telegraf) => {
  try {
    const monthKeyboard = new MonthInlineKeybord(
      botMessages.inputRequest.prompts.updateMethod.exerciseMonth,
    );
    const daysKeyboard = new DaysInlineKeyboard(
      botMessages.inputRequest.prompts.updateMethod.exerciseDay,
    );
    const weekKeyboard = new WeekInlineKeybaord(
      botMessages.inputRequest.prompts.updateMethod.exerciseWeek,
    );
    const updateExerciseController = async () => {
      const data = await WorkoutQueryFetcher.getExerciseByMonthDayWeekAndUserId(
        ctx.from!.id,
      );
      await ctx.reply(
        ExerciseFetchFormatter.formatExerciseByNameDayAndWeek(
          data,
          ctx,
          "updateMethod",
        ),
        {
          parse_mode: "Markdown",
        },
      );
      const exerciseKeyboard = new ExerciseSelectionInlineKeyboard(
        ctx,
        "updateMethod",
        "💪 Elige el ejercicio que quieres actualizar basándote en tus respuestas anteriores: ",
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
              nextStep: async () => await updateExerciseController(),
            }),
        }),
    });
  } catch (error) {
    console.error("Error: ", error);
  }
};
