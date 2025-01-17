import { Context, Telegraf } from "telegraf";
import { MessageTemplate } from "../../../../template/message";
import { deleteBotMessage } from "../../../../userState";
import {
  ExerciseFetchGraphTextLabels,
  ExerciseFetchGraphTextOptions,
} from "../models";
import {
  InlineKeyboardMarkup,
  Message,
} from "telegraf/typings/core/types/typegram";
import { ExerciseResultViewCallbackHandler } from "./exerciseResultViewCallbackHandler";

export class ExerciseResultViewInlineKeyboard extends MessageTemplate {
  private handleCallbacks: ExerciseResultViewCallbackHandler;
  constructor(private ctx: Context) {
    super();
    this.handleCallbacks = new ExerciseResultViewCallbackHandler(this.ctx);
  }
  protected prepareMessage() {
    const message = `_Como te gustaria obtener tus resultados_:`;
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(ExerciseFetchGraphTextLabels.GRAPHIC, {
            action: ExerciseFetchGraphTextOptions.GRAPHIC,
          }),
          this.createButton(ExerciseFetchGraphTextLabels.TEXT, {
            action: ExerciseFetchGraphTextOptions.TEXT,
          }),
        ],
      ],
    };
    return { message, keyboard };
  }
  async handleOptions(
    ctx: Context,
    _: Message,
    action: string,
    bot: Telegraf,
    userMessage: string,
  ) {
    await deleteBotMessage(ctx);
    const handlers: { [key: string]: () => Promise<any> } = {
      [ExerciseFetchGraphTextOptions.TEXT]: async () =>
        this.handleCallbacks.textCallback(bot, userMessage),
      [ExerciseFetchGraphTextOptions.GRAPHIC]: async () =>
        this.handleCallbacks.graphicCallback(bot, userMessage),
    };
    return handlers[action]();
  }
}
