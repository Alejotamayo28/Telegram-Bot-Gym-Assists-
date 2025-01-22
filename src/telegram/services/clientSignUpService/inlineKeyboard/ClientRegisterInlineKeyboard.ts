import { Context, Telegraf } from "telegraf";
import { MessageTemplate } from "../../../../template/message";
import { getUserCredentials } from "../../../../userState";
import {
  InlineKeyboardMarkup,
  Message,
} from "telegraf/typings/core/types/typegram";
import {
  ConfirmationMenuModel,
} from "../../../../model/confirmationMenuModel";
import { RegisterConfirmHandleCallback } from "./ClientRegisterInlineCallbackHandler";
import { verifySignUpOutput } from "../../../../utils/confirmOutputAction";

export class RegisterConfirmInlineKeyboard extends MessageTemplate {
  private handleCallback: RegisterConfirmHandleCallback;
  constructor(
    private ctx: Context,
    private passwordHash: string,
  ) {
    super();
    this.handleCallback = new RegisterConfirmHandleCallback(this.ctx);
  }
  userData = getUserCredentials(this.ctx.from!.id);
  protected prepareMessage() {
    const { id, nickname, password, email } = getUserCredentials(
      this.ctx.from!.id,
    );
    const message = verifySignUpOutput({ id, nickname, password, email });
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
        this.handleCallback.handleYesCallback(bot, this.passwordHash),
      [ConfirmationMenuModel.Callback.No]: async () =>
        this.handleCallback.handleNoCallback(bot),
    };
    return handlers[action]();
  }
}
