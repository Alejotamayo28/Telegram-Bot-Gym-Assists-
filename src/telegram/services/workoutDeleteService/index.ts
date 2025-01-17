import { Context, Telegraf } from "telegraf";
import { regexPattern, setUpKeyboardIteration, tryCatch } from "../utils";
import { ExerciseDeleteConfirmInlineKeyboard } from "./inlineKeyboard/exercise-delete-confirm-keyboard";
import { ExerciseVerificationCallbacks } from "../workoutPostService/models";
import { deleteBotMessage, saveBotMessage } from "../../../userState";
import { MonthInlineKeybord } from "../../utils/monthUtils/inlineKeyboard";
import { MonthCallbacks } from "../../utils/monthUtils/models";
import { DaysInlineKeyboard } from "../../utils/daysUtils/inlineKeyboard";
import { DaysCallbacks } from "../../utils/daysUtils/models";
import { botMessages } from "../../messages";
import { WeekInlineKeybaord } from "../../utils/weekUtils/inlineKeyboard";
import { WeekCallbacks } from "../../utils/weekUtils/models";
import { WorkoutQueryFetcher } from "../../../database/queries/exerciseQueries";
import { ExerciseFetchFormatter } from "../../../data-formatter.ts/exercise-fetch-formatter";
import { ExerciseSelectionInlineKeyboard } from "../../utils/exerciseUtils/ExerciseSelectionInlineKeyboard";

export const deleteExerciseVerificationController = async (
  ctx: Context,
  bot: Telegraf,
) => {
  const response = new ExerciseDeleteConfirmInlineKeyboard(ctx);
  try {
    const message = await response.sendCompleteMessage(ctx);
    saveBotMessage(ctx, message.message_id);
    bot.action(regexPattern(ExerciseVerificationCallbacks), async (ctx) => {
      await deleteBotMessage(ctx);
      const action = ctx.match[0];
      await tryCatch(
        () => response.handleOptions(ctx, message, action, bot),
        ctx,
      );
    });
  } catch (error) {
    console.error(`Error`, error);
  }
};
// Flow: Month -> Days -> Week -> exerciseName
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
      await ctx.reply(
        ExerciseFetchFormatter.formatExerciseByNameDayAndWeek(
          data,
          ctx,
          "deleteMethod",
        ),
        {
          parse_mode: "Markdown",
        },
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
