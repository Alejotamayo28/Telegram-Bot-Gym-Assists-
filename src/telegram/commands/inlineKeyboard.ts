import { Context, Markup } from "telegraf";
import {
  SIGN_UP_BUTTON, SIGN_UP_CALLBACK,
  SIGN_UP_EXAMPLE_BUTTON, SIGN_UP_EXAMPLE_CALLBACK
} from "../services/singUp/buttons";
import {
  LOGIN_BUTTON, LOGIN_CALLBACK, LOGIN_EXAMPLE_BUTTON,
  LOGIN_EXAMPLE_CALLBACK
} from "../services/login/buttons";
import { MessageTemplate } from "../../template/message";
import { InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram";
import { welcomeMessage } from "../messages/welcomeMessage";
import { BotStage, deleteBotMessage, updateUserStage } from "../../userState";
import { botMessages } from "../messages";
import { BotUtils } from "../services/singUp/functions";

export const startInlineKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback(LOGIN_BUTTON, LOGIN_CALLBACK),
  Markup.button.callback(SIGN_UP_BUTTON, SIGN_UP_CALLBACK)],
  [Markup.button.callback(LOGIN_EXAMPLE_BUTTON, LOGIN_EXAMPLE_CALLBACK),
  Markup.button.callback(SIGN_UP_EXAMPLE_BUTTON, SIGN_UP_EXAMPLE_CALLBACK)],
])

export enum CommandStartCallbacks {
  login = 'login',
  signUp = 'signUp',
  loginExample = 'loginExample',
  signUpExample = 'signUpExample'
}

const CommandStartLabels: { [key in CommandStartCallbacks]: string } = {
  [CommandStartCallbacks.login]: "Iniciar session",
  [CommandStartCallbacks.signUp]: "Craer cuenta",
  [CommandStartCallbacks.loginExample]: "Ejemplo iniciar session",
  [CommandStartCallbacks.signUpExample]: "Ejemplo crear cuenta"
}


export class StartCommandHadler extends MessageTemplate {
  protected prepareMessage() {
    const message = welcomeMessage
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [[
        this.createButton(CommandStartLabels.login, { action: CommandStartCallbacks.login }),
        this.createButton(CommandStartLabels.signUp, { action: CommandStartCallbacks.signUp })
      ],
      [
        this.createButton(CommandStartLabels.loginExample, { action: CommandStartCallbacks.loginExample })
      ],
      [
        this.createButton(CommandStartLabels.signUpExample, { action: CommandStartCallbacks.signUpExample })
      ]

      ]
    }
    return { message, keyboard }
  }
  async handleOptions(ctx: Context, message: Message, action: string) {
    await deleteBotMessage(ctx)
    const handlers: { [key: string]: () => Promise<void | Message> } = {
      [CommandStartCallbacks.login]: this.handleLoginCallback.bind(this, ctx),
      [CommandStartCallbacks.signUp]: this.handleSignUpCallback.bind(this, ctx),
      [CommandStartCallbacks.loginExample]: this.handleLoginExampleCallback.bind(this, ctx),
      [CommandStartCallbacks.signUpExample]: this.handleSignUpExampleCallback.bind(this, ctx)
    }
    if (handlers[action]) {
      return handlers[action]()
    }
  }
  private async handleLoginCallback(ctx: Context) {
    await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.auth.nickname)
    updateUserStage(ctx.from!.id, BotStage.Auth.NICKNAME)
  }
  private async handleSignUpCallback(ctx: Context) {
    await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.register.nickname)
    updateUserStage(ctx.from!.id, BotStage.Register.NICKNAME)
  }
  private async handleLoginExampleCallback(ctx: Context): Promise<void> {
    await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.auth.example, this.prepareMessage().keyboard)
  }
  private async handleSignUpExampleCallback(ctx: Context): Promise<void> {
    await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.register.example, this.prepareMessage().keyboard)
  }
}






