import { Context, Telegraf } from "telegraf";
import { deleteBotMessage } from "../../../../userState";
import { ExercisePostView } from "../../../../model/exerciseFetchModel";
import {
  InlineKeyboardMarkup,
  Message,
} from "telegraf/typings/core/types/typegram";

import { MessageTemplate } from "../../../../template/message";
import { ExerciseViewCallbackHandler } from "./ExerciseFetchInlineCallbackHandler";
import { botMessages } from "../../../messages";

export class ExerciseViewInlineKeyboard extends MessageTemplate {
  private callbackHandler: ExerciseViewCallbackHandler;
  constructor(private ctx: Context) {
    super();
    this.callbackHandler = new ExerciseViewCallbackHandler(this.ctx);
  }
  protected prepareMessage() {
    const message = botMessages.inputRequest.prompts.getMethod.askOutput;
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(ExercisePostView.Labels.lastWeek, {
            action: ExercisePostView.Callback.lastWeek,
          }),
          this.createButton(ExercisePostView.Labels.oneExercise, {
            action: ExercisePostView.Callback.oneExercise,
          }),
        ],
      ],
    };
    return { message, keyboard };
  }
  async handleOptions(ctx: Context, _: Message, action: string, bot: Telegraf) {
    await deleteBotMessage(ctx);
    const handlers: { [key: string]: () => Promise<void> } = {
      [ExercisePostView.Callback.lastWeek]: async () =>
        this.callbackHandler.getLastWeekExercisesRecordCallback(bot),
      [ExercisePostView.Callback.oneExercise]: async () =>
        this.callbackHandler.handleGetExerciseRecordByMonthCallback(bot),
    };
    return handlers[action]();
  }
}
