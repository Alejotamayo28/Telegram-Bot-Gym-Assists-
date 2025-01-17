import { Context, Telegraf } from "telegraf";
import { graphic } from "./workoutFetchHandler";
import { regexPattern, tryCatch } from "../utils";
import { ExerciseFetchGraphTextOptions, ExerciseViewOption } from "./models";
import {
  ExerciseViewInlineKeyboard
} from "./inlineKeyboard/exerciseViewKeyboard";
import { mainMenuPage } from "../menus/mainMenuHandler";
import { deleteUserMessage, saveBotMessage } from "../../../userState";
import { ExerciseResultViewInlineKeyboard } from "./inlineKeyboard/exerciseResultViewKeyboard";

export const handleGetDailyExercisesGraphic = async (
  ctx: Context,
  day: string,
  bot: Telegraf,
) => {
  await deleteUserMessage(ctx);
  try {
    const image = await graphic(ctx.from!.id, day);
    await ctx.replyWithPhoto(
      {
        source: image,
        filename: "exercise_chart.png",
      },
      {
        caption: `_Gráfico de ejercicios del dia ${day}._`,
        parse_mode: "Markdown",
      },
    );
    await mainMenuPage(ctx, bot);
  } catch (error) {
    console.error(`Error: `, error);
  }
};

export const fetchExerciseController = async (ctx: Context, bot: Telegraf) => {
  const response = new ExerciseViewInlineKeyboard(ctx);
  try {
    const message = await response.sendCompleteMessage(ctx);
    saveBotMessage(ctx, message.message_id);
    bot.action(regexPattern(ExerciseViewOption), async (ctx) => {
      const action = ctx.match[0];
      await tryCatch(
        () => response.handleOptions(ctx, message, action, bot),
        ctx,
      );
    });
  } catch (error) {
    console.error(`Error in handleGetExerciseOptions : `, error);
  }
};

export const fetchExerciseGraphTextController = async (
  ctx: Context,
  bot: Telegraf,
  userMessage: string,
) => {
  const response = new ExerciseResultViewInlineKeyboard(ctx);
  try {
    const message = await response.sendCompleteMessage(ctx);
    saveBotMessage(ctx, message.message_id);
    bot.action(regexPattern(ExerciseFetchGraphTextOptions), async (ctx) => {
      const action = ctx.match[0];
      await tryCatch(
        () => response.handleOptions(ctx, message, action, bot, userMessage),
        ctx,
      );
    });
  } catch (error) {
    console.error(`Error in fetchExerciseGraphTextController : `, error);
  }
};

//ENUMS QUE TENGO QUE MOVER EN UN FUTURO

export enum ExerciseIntervalOption {
  WEEK_1 = "semana1",
  WEEK_2 = "semana2",
  WEEK_3 = "semana3",
}

export const EXERCISE_INTERVALS_LABELS = {
  SEMANA_1: "🔹 Semana 1",
  SEMANA_2: "🔹 Semana 2",
  SEMANA_3: "🔹 Semana 3",
};
