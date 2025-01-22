import { Context, Telegraf } from "telegraf";
import { getUserExercise } from "../../../../userState";
import {
  InlineKeyboardMarkup,
  Message,
} from "telegraf/typings/core/types/typegram";
import { MessageTemplate } from "../../../../template/message";
import { ConfirmationMenuModel } from "../../../../model/confirmationMenuModel";
import { ExerciseUpdateCallbacksHandler } from "./ExerciseUpdateInlineCallbackHandler";
import { verifyExerciseOutput } from "../../../../utils/confirmOutputAction";

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
          this.createButton(ConfirmationMenuModel.Labels.yes, {
            action: ConfirmationMenuModel.Callback.Yes,
          }),
          this.createButton(ConfirmationMenuModel.Labels.no, {
            action: ConfirmationMenuModel.Callback.No,
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
      [ConfirmationMenuModel.Callback.Yes]: async () =>
        this.callbackHandler.handleYesCallback(bot),
      [ConfirmationMenuModel.Callback.No]: async () =>
        this.callbackHandler.handleNoCallback(bot),
    };
    return handlers[action]();
  }
}
