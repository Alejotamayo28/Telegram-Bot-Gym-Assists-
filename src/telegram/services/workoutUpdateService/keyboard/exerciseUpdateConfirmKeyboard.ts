import { Context, Telegraf } from "telegraf";
import { getUserExercise } from "../../../../userState";
import { verifyExerciseOutput } from "../../utils";
import {
  InlineKeyboardMarkup,
  Message,
} from "telegraf/typings/core/types/typegram";
import { MessageTemplate } from "../../../../template/message";
import {
  ExerciseVerificationCallbacks,
  ExerciseVerificationLabels,
} from "../../workoutPostService/models";
import { ExerciseUpdateCallbacksHandler } from "./exerciseUpdateCallbackHandler";

export class ExerciseUpdateConfirmInlineKeybaord extends MessageTemplate {
  private callbackHandler: ExerciseUpdateCallbacksHandler;
  constructor(private ctx: Context) {
    super();
    this.callbackHandler = new ExerciseUpdateCallbacksHandler(this.ctx);
  }
  workoutData = getUserExercise(this.ctx.from!.id);
  protected prepareMessage() {
    const message = verifyExerciseOutput(this.workoutData);
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(ExerciseVerificationLabels.YES, {
            action: ExerciseVerificationCallbacks.YES,
          }),
          this.createButton(ExerciseVerificationLabels.NO, {
            action: ExerciseVerificationCallbacks.NO,
          }),
        ],
      ],
    };
    return { message, keyboard };
  }
  async handleOptions(
    _: Context,
    message: Message,
    action: string,
    bot: Telegraf,
  ) {
    this.ctx.deleteMessage(message.message_id);
    const handlers: { [key: string]: () => Promise<void> } = {
      [ExerciseVerificationCallbacks.YES]: async () =>
        this.callbackHandler.handleYesCallback(bot),
      [ExerciseVerificationCallbacks.NO]: async () =>
        this.callbackHandler.handleNoCallback(bot),
    };
    return handlers[action]();
  }
}
