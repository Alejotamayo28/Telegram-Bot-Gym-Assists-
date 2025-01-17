import {
  InlineKeyboardMarkup,
  Message,
} from "telegraf/typings/core/types/typegram";
import { MessageTemplate } from "../../../template/message";
import { WeekCallbacks } from "./models";
import { Context, Telegraf } from "telegraf";
import { deleteBotMessage, updateUserState } from "../../../userState";
import { toNumber } from "lodash";

export class WeekInlineKeybaord extends MessageTemplate {
  protected prepareMessage() {
    const message = ``;
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(`Semana 1`, { action: WeekCallbacks.SEMANA_1 }),
          this.createButton(`Semana 2`, { action: WeekCallbacks.SEMANA_2 }),
        ],
        [
          this.createButton(`Semana 3`, { action: WeekCallbacks.SEMANA_3 }),
          this.createButton(`Semana 4`, { action: WeekCallbacks.SEMANA_4 }),
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
          week: toNumber(action),
        },
      },
    });
  }
}
