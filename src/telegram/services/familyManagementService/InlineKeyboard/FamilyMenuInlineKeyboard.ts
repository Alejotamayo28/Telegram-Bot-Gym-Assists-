import { Context, Telegraf } from "telegraf";
import { MessageTemplate } from "../../../../template/message";
import {
  InlineKeyboardMarkup,
  Message,
} from "telegraf/typings/core/types/typegram";
import { deleteBotMessage } from "../../../../userState";
import { FamilyMenuModel } from "../../../../model/familyMenuModel";
import { FamilyMenuCallbackHandler } from "./FamilyMenuInlineCallbackHandler";
import { botMessages } from "../../../messages";

export class FamilyInlineKeyboard extends MessageTemplate {
  private handleCallback: FamilyMenuCallbackHandler;
  constructor(private ctx: Context) {
    super();
    this.handleCallback = new FamilyMenuCallbackHandler(this.ctx);
  }
  protected prepareMessage() {
    const message = botMessages.inputRequest.prompts.familyMethod.menu;
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(FamilyMenuModel.Label.viewFamily, {
            action: FamilyMenuModel.Callback.viewFamily,
          }),
          this.createButton(FamilyMenuModel.Label.joinFamily, {
            action: FamilyMenuModel.Callback.joinFamily,
          }),
        ],
        [
          this.createButton(FamilyMenuModel.Label.createFamily, {
            action: FamilyMenuModel.Callback.createFamily,
          }),
        ],
      ],
    };
    return { message, keyboard };
  }
  async handleOptions(_: Context, __: Message, action: string, bot: Telegraf) {
    await deleteBotMessage(this.ctx);
    const handler: { [key: string]: () => Promise<void> } = {
      [FamilyMenuModel.Callback.viewFamily]: async () =>
        this.handleCallback.handleViewFamilies(bot),
      [FamilyMenuModel.Callback.createFamily]: async () =>
        this.handleCallback.handleCreateFamily(),
      [FamilyMenuModel.Callback.joinFamily]: async () =>
        this.handleCallback.handleJoinFamily(),
    };
    return handler[action]();
  }
}
