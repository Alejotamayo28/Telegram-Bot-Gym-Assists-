import { Context, Telegraf } from "telegraf";
import { MessageTemplate } from "../../../../template/message";
import { deleteBotMessage } from "../../../../userState";
import { botMessages } from "../../../messages";
import {
  InlineKeyboardMarkup,
  Message,
} from "telegraf/typings/core/types/typegram";
import { ProfileCallbackHanler } from "./ProfileInlineCallbackHandler";
import { ProfileMenuModel } from "../../../../model/profileMenuModel";

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
          this.createButton(ProfileMenuModel.Label.fetchProfile, {
            action: ProfileMenuModel.Callback.fetchProfile,
          }),
          this.createButton(ProfileMenuModel.Label.editProfile, {
            action: ProfileMenuModel.Callback.editProfile
          }),
        ],
      ],
    };
    return { message, keyboard };
  }
  async handleOptions(ctx: Context, _: Message, action: string, bot: Telegraf) {
    await deleteBotMessage(ctx);
    const handlers: { [key: string]: () => Promise<void> } = {
      [ProfileMenuModel.Callback.fetchProfile]: async () =>
        this.callbackHandler.handleFetchProfileCallback(bot),
      [ProfileMenuModel.Callback.editProfile]: async () =>
        this.callbackHandler.handleUpdateProfileCallback(bot),
    };
    return handlers[action]();
  }
}
