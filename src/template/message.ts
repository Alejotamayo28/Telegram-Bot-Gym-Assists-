import { Context, Telegraf } from "telegraf";
import { InlineKeyboardButton, InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram";
import { deleteBotMessage } from "../userState";


export interface CallbackData {
  action: string;
  [key: string]: any;
}
export abstract class MessageTemplate {
  constructor(protected taskDone?: string) { }
  protected abstract handleOptions(ctx?: Context, message?: Message, action?: string, bot?: Telegraf, userMessage?: string): any
  protected abstract prepareMessage(): {
    message: string,
    keyboard: InlineKeyboardMarkup
  }
  protected createButton(text: string, callbackData: CallbackData): InlineKeyboardButton {
    return {
      text,
      callback_data: callbackData.action
    }
  }
  async sendCompleteMessage(ctx: Context): Promise<Message> {
    try {
      if (!this.taskDone) {
        const { message, keyboard } = this.prepareMessage()
        return await ctx.reply(message, {
          parse_mode: "Markdown",
          reply_markup: keyboard
        })
      } else {
        const { keyboard } = this.prepareMessage()
        return await ctx.reply(this.taskDone, {
          parse_mode: "Markdown",
          reply_markup: keyboard
        })
      }
    }
    catch (error) {
      console.error(`Error: `, error)
      throw error
    }
  }
}

export abstract class ExerciseUpdateTemplate {
  protected abstract updateUserState(ctx: Context, message: string): void
  protected abstract replyMessage(): string
  async handle(ctx: Context, message: string) {
    const value = message.toLowerCase()
    try {
      this.updateUserState(ctx, value)
      await deleteBotMessage(ctx)
      await ctx.reply(this.replyMessage(), {
        parse_mode: "Markdown"
      })
    } catch (error) {
      console.error(`Error: `, error)
    }
  }
}

