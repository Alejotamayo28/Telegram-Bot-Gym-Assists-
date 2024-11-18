import { Context, Telegraf } from "telegraf";
import { InlineKeyboardButton, InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram";
import { userState } from "../userState";

export interface CallbackData {
  action: string;
  [key: string]: any;
}

/**
 * MessageTemplate
 * Abstract class to handle and prepare templates with inline buttons
 * Classes extending MessageTemplate should implement the message preparation and options handling logic
 */
export abstract class MessageTemplate {

  /**
   * Handles specific actions based on the user interactions
  @param ctx - The context of the current message
  @param message - The incoming message object
  @param action - Action indentifier to be handled
  @param bot - Instance of the Telegraf bot
  @param userMessage - (Optional) Additional message from the user
  */
  protected abstract handleOptions(ctx: Context, message: Message, action: string, bot: Telegraf, userMessage: string): any

  /**
   * Prepares the message content and inline keyboard structure
   * @returns An object containing the message text and inline keyboard markup
  */
  protected abstract prepareMessage(): {
    message: string,
    keyboard: InlineKeyboardMarkup
  }

  /**
  * Creates an inline keyboard button with specified text and callback data
  * @param text - button label 
  * @param callbackData - Data that specifies the action when the button is pressed
  * @returns Inline keyboard button object
  */
  protected createButton(text: string, callbackData: CallbackData): InlineKeyboardButton {
    return {
      text,
      callback_data: callbackData.action
    }
  }

  /**
    * Sends a complete message with inline keyboard to the user
    * @param ctx - The context of the current message
    * @returns the sent message object
    */
  async sendCompleteMessage(ctx: Context): Promise<Message> {
    try {
      const { message, keyboard } = this.prepareMessage()
      return await ctx.reply(message, {
        parse_mode: "Markdown",
        reply_markup: keyboard
      })
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
      await ctx.deleteMessage()
      await ctx.reply(this.replyMessage(), {
        parse_mode: "Markdown"
      })
    } catch (error) {
      console.error(`Error: `, error)
    }
  }
}

