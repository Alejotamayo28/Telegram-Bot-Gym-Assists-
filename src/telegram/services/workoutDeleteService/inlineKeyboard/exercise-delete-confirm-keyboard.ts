import { Context, Telegraf } from "telegraf";
import {
  deleteBotMessage,
  Exercise,
  getUserExercise,
} from "../../../../userState";
import { verifyDeleteExercise } from "../../utils";
import {
  InlineKeyboardMarkup,
  Message,
} from "telegraf/typings/core/types/typegram";
import { MessageTemplate } from "../../../../template/message";
import {
  ExerciseVerificationCallbacks,
  ExerciseVerificationLabels,
} from "../../workoutPostService/models";
import { ExerciseDeleteCallbackHandler } from "./exercise-delete-callback-handler";

export class ExerciseDeleteConfirmInlineKeyboard extends MessageTemplate {
  private callbackHandler: ExerciseDeleteCallbackHandler;
  constructor(private ctx: Context) {
    super();
    this.callbackHandler = new ExerciseDeleteCallbackHandler(ctx);
  }
  private workoutData: Exercise = getUserExercise(this.ctx.from!.id);
  protected prepareMessage() {
    const message = verifyDeleteExercise(this.workoutData);
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
    ctx: Context,
    _: Message,
    action: string,
    bot: Telegraf,
  ) {
    await deleteBotMessage(ctx);
    const handlers: { [key: string]: () => Promise<void> } = {
      [ExerciseVerificationCallbacks.YES]: async () =>
        this.callbackHandler.handleYesCallback(bot),
      [ExerciseVerificationCallbacks.NO]: async () =>
        this.callbackHandler.handleNoCallback(bot),
    };
    return handlers[action]();
  }
}
