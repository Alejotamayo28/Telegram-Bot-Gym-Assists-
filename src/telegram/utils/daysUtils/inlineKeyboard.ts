import { InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram"
import { MessageTemplate } from "../../../template/message"
import { deleteBotMessage, userStateUpdateDay } from "../../../userState"
import { Context, Telegraf } from "telegraf"
import { DaysCallbacks } from "./models"

export class DaysInlineKeyboard extends MessageTemplate {
  protected prepareMessage() {
    const message = `holaaaaaaaaaa`
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(`Lunes`, { action: DaysCallbacks.LUNES }),
          this.createButton(`Martes`, { action: DaysCallbacks.MARTES }),
          this.createButton(`Miercoles`, { action: DaysCallbacks.MIERCOLES })
        ], [
          this.createButton(`Jueves`, { action: DaysCallbacks.JUEVES }),
          this.createButton(`Viernes`, { action: DaysCallbacks.VIERNES })
        ], [
          this.createButton(`Sabado`, { action: DaysCallbacks.SABADO }),
          this.createButton(`Domingo`, { action: DaysCallbacks.DOMINGO })
        ]
      ]
    }
    return { message, keyboard }
  }
  async handleOptions(ctx: Context, _: Message, action: string, bot: Telegraf) {
    await deleteBotMessage(ctx)
    userStateUpdateDay(ctx, action.toLowerCase())
    /* const { month, day } = userState[ctx.from!.id]
     const data = await ExerciseQueryFetcher.ExerciseByIdAndDayAndMonth(ctx.from!.id, day, month)
     await exercisesInlineKeybaord(ctx, bot, data)
     await exercisesInlineKeybaord(ctx, bot, data)
     */
  }
}
