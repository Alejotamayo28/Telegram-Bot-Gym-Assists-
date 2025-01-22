import { Context, Telegraf } from "telegraf";
import {
  InlineKeyboardMarkup,
  Message,
} from "telegraf/typings/core/types/typegram";
import { MessageTemplate } from "../../../../template/message";
import {
  ConfirmationMenuModel,
} from "../../../../model/confirmationMenuModel";
import { ExerciseDeleteCallbackHandler } from "./ExerciseDeleteInlineCallbackHandler";
import { deleteBotMessage, Exercise, getUserExercise } from "../../../../userState";
import { verifyDeleteExercise } from "../../../../utils/confirmOutputAction";

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
    ctx: Context,
    _: Message,
    action: string,
    bot: Telegraf,
  ) {
    await deleteBotMessage(ctx);
    const handlers: { [key: string]: () => Promise<void> } = {
      [ConfirmationMenuModel.Callback.Yes]: async () =>
        this.callbackHandler.handleYesCallback(bot),
      [ConfirmationMenuModel.Callback.No]: async () =>
        this.callbackHandler.handleNoCallback(bot),
    };
    return handlers[action]();
  }
}
