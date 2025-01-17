import { Context, Telegraf } from "telegraf";
import { MessageTemplate } from "../../../../template/message";
import { deleteBotMessage } from "../../../../userState";
import { botMessages } from "../../../messages";
import { ClientEditProfileCallbacks } from "../models";
import {
  InlineKeyboardMarkup,
  Message,
} from "telegraf/typings/core/types/typegram";
import { EditProfileCallbacksHandler } from "./editProfileCallbackHandler";

type handlerFunction = (
  ctx: Context,
  message: Message,
  bot: Telegraf,
) => Promise<void>;

type Handlers = {
  [key: string]: handlerFunction;
};

export class EditProfileInlineKeyboard extends MessageTemplate {
  private handleCallback: EditProfileCallbacksHandler;
  constructor(private ctx: Context) {
    super();
    this.handleCallback = new EditProfileCallbacksHandler(this.ctx);
  }
  prepareMessage() {
    const message =
      botMessages.inputRequest.prompts.profile.editProfileMenuMessage;
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton("Nickname", {
            action: ClientEditProfileCallbacks.NICKNAME,
          }),
          this.createButton("Contrasena", {
            action: ClientEditProfileCallbacks.PASSWORD,
          }),
          this.createButton("Email", {
            action: ClientEditProfileCallbacks.EMAIL,
          }),
        ],
        [
          this.createButton("Nombre", {
            action: ClientEditProfileCallbacks.NAME,
          }),
          this.createButton("Apellido", {
            action: ClientEditProfileCallbacks.LAST_NAME,
          }),
          this.createButton("Edad", {
            action: ClientEditProfileCallbacks.AGE,
          }),
        ],
        [
          this.createButton("Peso", {
            action: ClientEditProfileCallbacks.WEIGHT,
          }),
          this.createButton("Altura", {
            action: ClientEditProfileCallbacks.HEIGHT,
          }),
        ],
      ],
    };
    return { message, keyboard };
  }
  private readonly handlers: Handlers = {
    [ClientEditProfileCallbacks.NICKNAME]: async () =>
      this.handleCallback.handleEditNickname(),
    [ClientEditProfileCallbacks.PASSWORD]: async () =>
      this.handleCallback.handleEditPassword(),
    [ClientEditProfileCallbacks.EMAIL]: async () =>
      this.handleCallback.handleEditEmail(),
    [ClientEditProfileCallbacks.NAME]: async () =>
      this.handleCallback.handleEditName(),
    [ClientEditProfileCallbacks.LAST_NAME]: async () =>
      this.handleCallback.handleEditLastName(),
    [ClientEditProfileCallbacks.AGE]: async () =>
      this.handleCallback.handleEditAge(),
    [ClientEditProfileCallbacks.WEIGHT]: async () =>
      this.handleCallback.handleEditWeight(),
    [ClientEditProfileCallbacks.HEIGHT]: async () =>
      this.handleCallback.handleEditHeight(),
  };
  async handleOptions(
    ctx: Context,
    message: Message,
    action: string,
    bot: Telegraf,
  ) {
    try {
      await deleteBotMessage(ctx);
      const handler = this.handlers[action];
      if (!handler)
        throw new Error(`Handler not implemented for action: ${action}`);
      return await handler(ctx, message, bot);
    } catch (error) {
      console.error(`Error handling action ${action}: `, action);
    }
  }
}
