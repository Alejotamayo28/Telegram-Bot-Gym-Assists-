import { Context, Telegraf } from "telegraf";
import { deleteBotMessage } from "../../../../userState";
import {
  EXERCISE_VIEW_LABELS,
  ExerciseViewOption,
} from "../models";
import { msgExerciseViewOptionsMD } from "../messages";
import {
  InlineKeyboardMarkup,
  Message,
} from "telegraf/typings/core/types/typegram";
import { MessageTemplate } from "../../../../template/message";
import { ExerciseViewCallbackHandler } from "./exerciseViewCallbackHandler";

export class ExerciseViewInlineKeyboard extends MessageTemplate {
  private callbackHandler: ExerciseViewCallbackHandler;
  constructor(private ctx: Context) {
    super();
    this.callbackHandler = new ExerciseViewCallbackHandler(this.ctx);
  }
  protected prepareMessage() {
    const message = msgExerciseViewOptionsMD;
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(EXERCISE_VIEW_LABELS.lastWeek, {
            action: ExerciseViewOption.lastWeek,
          }),
          this.createButton(EXERCISE_VIEW_LABELS.oneExercise, {
            action: ExerciseViewOption.oneExercise,
          }),
        ],
      ],
    };
    return { message, keyboard };
  }
  async handleOptions(ctx: Context, _: Message, action: string, bot: Telegraf) {
    await deleteBotMessage(ctx);
    const handlers: { [key: string]: () => Promise<void> } = {
      [ExerciseViewOption.lastWeek]: async () =>
        this.callbackHandler.getLastWeekExercisesRecordCallback(bot),
      [ExerciseViewOption.oneExercise]: async () =>
        this.callbackHandler.handleGetExerciseRecordByMonthCallback(bot),
    };
    return handlers[action]();
  }
}

