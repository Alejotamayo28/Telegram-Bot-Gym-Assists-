import { Context, Markup, Telegraf } from "telegraf";
import { userStageGetExercise, userStateUpdateStage } from "../../../userState";
import { EXERCISE_VIEW_LABELS, ExerciseViewOption } from "./models";
import { msgExerciseViewOptionsMD } from "./messages";
import { InlineKeyboardButton, InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram";
import { EXERCISE_INTERVALS_LABELS, ExerciseIntervalOption, handleGetExercisesByInterval, handleGetWeeklyExercises } from ".";
import { ExerciseQueryFetcher } from "./queries";
import { sendMenuFunctions } from "../../menus/userMenu";
import { GET_EXERCISE_DAY_OUTPUT } from "../../mainMenu/messages";

export interface CallbackData {
  action: string;
  [key: string]: any;
}

export abstract class BaseInlineKeyboard {
  protected abstract createMessage(): string
  protected abstract createButton(text: string, callbackData: CallbackData): InlineKeyboardButton;
  protected abstract getKeyboard(): InlineKeyboardMarkup;
}

export abstract class BaseHandler {
  abstract sendCompleteMessage(ctx: Context): Promise<Message>
  abstract handleActions(ctx: Context, message: Message, action: string, bot: Telegraf): any
}


class ExerciseFetchInterval extends BaseInlineKeyboard {
  createMessage(): string {
    return `📅 *Aquí están tus ejercicios de las últimas 3 semanas: *\n\nSelecciona una semana para ver los detalles:`
  }
  protected createButton(text: string, callbackData: CallbackData): InlineKeyboardButton {
    return {
      text,
      callback_data: JSON.stringify(callbackData)
    }
  }
  getKeyboard(): InlineKeyboardMarkup {
    return {
      inline_keyboard: [
        [
          this.createButton(EXERCISE_INTERVALS_LABELS.SEMANA_1, {
            action: ExerciseIntervalOption.WEEK_1
          })
        ],
        [
          this.createButton(EXERCISE_INTERVALS_LABELS.SEMANA_2, {
            action: ExerciseIntervalOption.WEEK_2
          })
        ],
        [
          this.createButton(EXERCISE_INTERVALS_LABELS.SEMANA_3, {
            action: ExerciseIntervalOption.WEEK_3
          })
        ]]
    };
  }
}

export class ExerciseIntervalHandler extends ExerciseFetchInterval {
  public async sendExerciseIntervalOptions(ctx: Context): Promise<Message> {
    return await ctx.reply(this.createMessage(), {
      parse_mode: "Markdown",
      reply_markup: this.getKeyboard()
    })
  }
  async handleOption(ctx: Context, message: Message, action: string) {
    const handlers: { [key: string]: () => Promise<any> } = {
      [ExerciseIntervalOption.WEEK_1]: async () => {
        await ctx.deleteMessage(message.message_id)
        await ExerciseQueryFetcher.ExerciseIntervalFirtsWeek(ctx)
      },
      [ExerciseIntervalOption.WEEK_2]: async () => {
        await ctx.deleteMessage(message.message_id);
        await ExerciseQueryFetcher.ExeriseIntervalSecondWeek(ctx)
      },
      [ExerciseIntervalOption.WEEK_3]: async () => {
        await ctx.deleteMessage(message.message_id);
        await ExerciseQueryFetcher.ExeriseIntervalThirdWeek(ctx)
      }
    };
    if (handlers[action]) {
      return handlers[action]();
    }
  }
}

class ExerciseFetch extends BaseInlineKeyboard {
  createMessage(): string {
    return msgExerciseViewOptionsMD
  }
  protected createButton(text: string, callbackData: CallbackData): InlineKeyboardButton {
    return {
      text,
      callback_data: JSON.stringify(callbackData)
    }
  }
  protected getKeyboard(): InlineKeyboardMarkup {
    return {
      inline_keyboard: [
        [
          this.createButton(EXERCISE_VIEW_LABELS.DAILY, {
            action: ExerciseViewOption.DAILY
          }), this.createButton(EXERCISE_VIEW_LABELS.WEEKLY, {
            action: ExerciseViewOption.WEEKLY
          })
        ],
        [
          this.createButton(EXERCISE_VIEW_LABELS.INTERVAL, {
            action: ExerciseViewOption.INTERVAL
          })
        ]
      ]
    }
  }
}



export class ExerciseFetchHanlder extends ExerciseFetch implements BaseHandler {
  async sendCompleteMessage(ctx: Context) {
    return await ctx.reply(this.createMessage(), {
      parse_mode: "Markdown",
      reply_markup: this.getKeyboard()
    })
  }
  async handleActions(ctx: Context, message: Message, action: string, bot: Telegraf) {
    const handlers: { [key: string]: () => Promise<void> } = {
      [ExerciseViewOption.DAILY]: async () => {
        await ctx.deleteMessage(message.message_id);
        await ctx.reply(GET_EXERCISE_DAY_OUTPUT, { parse_mode: "MarkdownV2" });
        userStateUpdateStage(ctx, userStageGetExercise.GET_EXERCISE_OPTIONS);
      },
      [ExerciseViewOption.WEEKLY]: async () => {
        await ctx.deleteMessage(message.message_id)
        await Promise.all([handleGetWeeklyExercises(ctx), sendMenuFunctions(ctx)]);
      },
      [ExerciseViewOption.INTERVAL]: async () => {
        await ctx.deleteMessage(message.message_id)
        await handleGetExercisesByInterval(ctx, bot);
      }
    };
    if (handlers[action]) {
      return handlers[action]();
    }
  }
}


//TECLADO inlineKeyboard  

export const inlineKeyboardGetDailyExercicses = Markup.inlineKeyboard([
  [Markup.button.callback(`📝 Grafico `, 'grafico')],
  [Markup.button.callback(`🔄 Texto`, 'texto')]
])

export const inlineKeyboardGetMenu = Markup.inlineKeyboard([
  [Markup.button.callback(`Intervalo`, `intervaloOption`)]
])

export const testingGet = async (ctx: Context, bot: Telegraf) => {
  await ctx.reply(`intervalo testing futures --testing--`, {
    reply_markup: inlineKeyboardGetMenu.reply_markup
  })
  bot.action(`intervaloOption`, async (ctx: Context) => {
    await ctx.reply(`Escribe el dia del intervalo`, {
      parse_mode: "Markdown"
    })
    userStateUpdateStage(ctx, `getOptions`)
  })
}



