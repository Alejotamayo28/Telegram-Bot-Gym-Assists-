import { Context, Telegraf } from "telegraf";
import { MessageTemplate } from "../../../../template/message";
import {
  InlineKeyboardMarkup,
  Message,
} from "telegraf/typings/core/types/typegram";
import { deleteBotMessage, getUserExercise } from "../../../../userState";
import {
  ConfirmationMenuModel,
} from "../../../../model/confirmationMenuModel";
import { verifyExerciseOutput } from "../../../../utils/confirmOutputAction";
import { PostVerifactionCallbackHandler } from "./ExercisePostInlineCallbackHandler";

export class ExercisePostVerificationHandler extends MessageTemplate {
  private handleCallback: PostVerifactionCallbackHandler;
  constructor(private ctx: Context) {
    super();
    this.handleCallback = new PostVerifactionCallbackHandler(this.ctx);
  }
  workoutData = getUserExercise(this.ctx.from!.id);
  protected prepareMessage() {
    const message = verifyExerciseOutput(this.workoutData);
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(ConfirmationMenuModel.Callback.Yes, {
            action: ConfirmationMenuModel.Callback.Yes,
          }),
          this.createButton(ConfirmationMenuModel.Callback.No, {
            action: ConfirmationMenuModel.Callback.No,
          }),
        ],
      ],
    };
    return { message, keyboard };
  }
  async handleOptions(_: Context, __: Message, action: string, bot: Telegraf) {
    await deleteBotMessage(this.ctx);
    const handlers: { [key: string]: () => Promise<void> } = {
      [ConfirmationMenuModel.Callback.Yes]: async () =>
        this.handleCallback.handleYesCallback(bot),
      [ConfirmationMenuModel.Callback.No]: async () =>
        this.handleCallback.handleNoCallback(bot),
    };
    return handlers[action]();
  }
}
