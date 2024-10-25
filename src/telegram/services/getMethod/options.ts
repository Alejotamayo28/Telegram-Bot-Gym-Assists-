import { Context, Telegraf } from "telegraf";
import { ExerciseViewOption } from "./models";
import { GET_EXERCISE_DAY_OUTPUT } from "../../mainMenu/messages";
import { handleGetExercisesByInterval, handleGetWeeklyExercises } from ".";
import { sendMenuFunctions } from "../../menus/userMenu";
import { Message } from "telegraf/typings/core/types/typegram";
import { userStageGetExercise, userStateUpdateStage } from "../../../userState";

export const handleExerciseOption = async (ctx: Context, message: Message, action: string, bot: Telegraf) => {
  const handlers: { [key: string]: () => Promise<void> } = {
    [ExerciseViewOption.DAILY]: async () => {
      await ctx.deleteMessage(message.message_id);
      await ctx.reply(GET_EXERCISE_DAY_OUTPUT, { parse_mode: "MarkdownV2" });
      userStateUpdateStage(ctx, userStageGetExercise.GET_EXERCISE_OPTIONS);
    },
    [ExerciseViewOption.WEEKLY]: async () => {
      await ctx.deleteMessage(message.message_id)
      await Promise.all([handleGetWeeklyExercises(ctx), sendMenuFunctions(ctx)]);
    },
    [ExerciseViewOption.INTERVAL]: async () => {
      await ctx.deleteMessage(message.message_id)
      await handleGetExercisesByInterval(ctx, bot);
    }
  };
  if (handlers[action]) {
    return handlers[action]();
  }
};


