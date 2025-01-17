import { Context, Telegraf } from "telegraf";
import { MessageTemplate } from "../../../../template/message";
import { deleteBotMessage } from "../../../../userState";
import { botMessages } from "../../../messages";
import { ClientProfileCallbacks } from "../models";
import {
  InlineKeyboardMarkup,
  Message,
} from "telegraf/typings/core/types/typegram";
import { ProfileCallbackHanler } from "./profileCallbackHandler";

export class ProfileOptionsInlineKeyboard extends MessageTemplate {
  private callbackHandler: ProfileCallbackHanler;
  constructor(private ctx: Context) {
    super();
    this.callbackHandler = new ProfileCallbackHanler(this.ctx);
  }
  prepareMessage() {
    const message = botMessages.inputRequest.prompts.profile.profileMenuMessage;
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(`Ver perfil`, {
            action: ClientProfileCallbacks.FETCH_PROFILE,
          }),
          this.createButton(`Editar perfil`, {
            action: ClientProfileCallbacks.EDIT_PROFILE,
          }),
        ],
      ],
    };
    return { message, keyboard };
  }
  async handleOptions(ctx: Context, _: Message, action: string, bot: Telegraf) {
    await deleteBotMessage(ctx);
    const handlers: { [key: string]: () => Promise<void> } = {
      [ClientProfileCallbacks.FETCH_PROFILE]: async () =>
        this.callbackHandler.handleUpdateProfileCallback(bot),
      [ClientProfileCallbacks.EDIT_PROFILE]: async () =>
        this.callbackHandler.handleUpdateProfileCallback(bot),
    };
    return handlers[action]();
  }
}
