import { Context } from "telegraf";
import { MessageTemplate } from "../../../template/message";
import {
  deleteBotMessage,
  updateUserStage,
  BotStage,
} from "../../../userState";
import { botMessages } from "../../messages";
import { BotUtils } from "../../services/clientSignUpService/functions";
import {
  InlineKeyboardMarkup,
  Message,
} from "telegraf/typings/core/types/typegram";
import { CommandStartCallbacks, CommandStartLabels } from "./models";

export class StartCommandHadler extends MessageTemplate {
  protected prepareMessage() {
    const message = botMessages.menus.mainMenu;
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(CommandStartLabels.login, {
            action: CommandStartCallbacks.login,
          }),
          this.createButton(CommandStartLabels.signUp, {
            action: CommandStartCallbacks.signUp,
          }),
        ],
        [
          this.createButton(CommandStartLabels.loginExample, {
            action: CommandStartCallbacks.loginExample,
          }),
        ],
        [
          this.createButton(CommandStartLabels.signUpExample, {
            action: CommandStartCallbacks.signUpExample,
          }),
        ],
      ],
    };
    return { message, keyboard };
  }
  async handleOptions(ctx: Context, _: Message, action: string) {
    await deleteBotMessage(ctx);
    const handlers: { [key: string]: () => Promise<void | Message> } = {
      [CommandStartCallbacks.login]: this.handleLoginCallback.bind(this, ctx),
      [CommandStartCallbacks.signUp]: this.handleSignUpCallback.bind(this, ctx),
      [CommandStartCallbacks.loginExample]:
        this.handleLoginExampleCallback.bind(this, ctx),
      [CommandStartCallbacks.signUpExample]:
        this.handleSignUpExampleCallback.bind(this, ctx),
    };
    if (handlers[action]) {
      return handlers[action]();
    }
  }
  private async handleLoginCallback(ctx: Context) {
    await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.auth.nickname);
    return updateUserStage(ctx.from!.id, BotStage.Auth.NICKNAME);
  }
  private async handleSignUpCallback(ctx: Context) {
    await BotUtils.sendBotMessage(
      ctx,
      botMessages.inputRequest.register.nickname,
    );
    return updateUserStage(ctx.from!.id, BotStage.Register.NICKNAME);
  }
  private async handleLoginExampleCallback(ctx: Context): Promise<void> {
    return await BotUtils.sendBotMessage(
      ctx,
      botMessages.inputRequest.auth.example,
      this.prepareMessage().keyboard,
    );
  }
  private async handleSignUpExampleCallback(ctx: Context): Promise<void> {
    return await BotUtils.sendBotMessage(
      ctx,
      botMessages.inputRequest.register.example,
      this.prepareMessage().keyboard,
    );
  }
}
