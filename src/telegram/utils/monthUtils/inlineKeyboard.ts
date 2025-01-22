import { botMessages } from "../../messages";
import { MonthCallbacks } from "./models";
import { Context, Telegraf } from "telegraf";
import { deleteBotMessage, updateUserState } from "../../../userState";
import { MessageTemplate } from "../../../template/message";
import {
  InlineKeyboardMarkup,
  Message,
} from "telegraf/typings/core/types/typegram";

export class MonthInlineKeybord extends MessageTemplate {
  protected prepareMessage() {
    const message = botMessages.inputRequest.prompts.deleteMethod.exerciseMonth;
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(`Enero`, { action: MonthCallbacks.ENERO }),
          this.createButton(`Febrero`, { action: MonthCallbacks.FEBRERO }),
          this.createButton(`Marzo`, { action: MonthCallbacks.MARZO }),
        ],
        [
          this.createButton(`Abril`, { action: MonthCallbacks.ABRIL }),
          this.createButton(`Mayo`, { action: MonthCallbacks.MAYO }),
          this.createButton(`Junio`, { action: MonthCallbacks.JUNIO }),
        ],
        [
          this.createButton(`Julio`, { action: MonthCallbacks.JULIO }),
          this.createButton(`Agosto`, { action: MonthCallbacks.AGOSTO }),
          this.createButton(`Septiembre`, {
            action: MonthCallbacks.SEPTIEMBRE,
          }),
        ],
        [
          this.createButton(`Octubre`, { action: MonthCallbacks.OCTUBRE }),
          this.createButton(`Noviembre`, { action: MonthCallbacks.NOVIMEBRE }),
          this.createButton(`Diciembre`, { action: MonthCallbacks.DICIEMBRE }),
        ],
      ],
    };
    return { message, keyboard };
  }
  async handleOptions(ctx: Context, _: Message, action: string, bot: Telegraf) {
    await deleteBotMessage(ctx);
    updateUserState(ctx.from!.id, {
      data: {
        exercise: {
          month: action,
        },
      },
    });
  }
}
