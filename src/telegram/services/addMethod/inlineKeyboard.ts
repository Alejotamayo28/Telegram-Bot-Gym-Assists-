import { Context, Markup, Telegraf } from "telegraf";
import { VERIFY_EXERCISE_NO, VERIFY_EXERCISE_NO_CALLBACK, VERIFY_EXERCISE_YES, VERIFY_EXERCISE_YES_CALLBACK } from "./buttons";
import { MessageTemplate } from "../../../template/message";
import { insertWorkoutQueryTESTING, verifyExerciseOutput } from "../utils";
import { createTextSpan } from "typescript";
import { InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram";
import { PartialWorkout } from "../../../model/workout";
import { userState } from "../../../userState";
import { onTransaction } from "../../../database/dataAccessLayer";
import { EXERCISE_NOT_SUCCESFULLY_CREATED, EXERCISE_SUCCESFULLY_CREATED } from "./messages";
import { inlineKeyboardMenu } from "../../mainMenu/inlineKeyboard";

export class ExercisePostVerificationHandler extends MessageTemplate {
  private workoutData: PartialWorkout = userState[this.ctx.from!.id]
  constructor(private ctx: Context) {
    super()
  }
  protected prepareMessage() {
    const message = verifyExerciseOutput(this.workoutData)
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(`siiiiiiiiiii`, { action: VERIFY_EXERCISE_YES_CALLBACK }),
          this.createButton(`nooooooooooo`, { action: VERIFY_EXERCISE_NO_CALLBACK })
        ]
      ]
    }
    return { message, keyboard }
  }
   async handleOptions(ctx: Context, message: Message, action: string, bot: Telegraf, userMessage?: string) {
    const handlers: { [key: string]: () => Promise<void> } = {
      [VERIFY_EXERCISE_YES_CALLBACK]: async () => {
        await ctx.deleteMessage()
        await onTransaction(async (transactionWorkout) => {
          await insertWorkoutQueryTESTING(this.workoutData, ctx, transactionWorkout)
        })
        await ctx.reply(EXERCISE_SUCCESFULLY_CREATED, {
          parse_mode: 'MarkdownV2',
          ...inlineKeyboardMenu
        })
      },
      [VERIFY_EXERCISE_NO_CALLBACK]: async () => {
        await ctx.deleteMessage()
        await ctx.reply(EXERCISE_NOT_SUCCESFULLY_CREATED, {
          parse_mode: 'MarkdownV2',
          ...inlineKeyboardMenu
        })
      }
    }
    if (handlers[action]) {
      return handlers[action]()
    }
  }
}

export const inlineKeyboardVerifyExercise = Markup.inlineKeyboard([
  [Markup.button.callback(VERIFY_EXERCISE_YES, VERIFY_EXERCISE_YES_CALLBACK),
  Markup.button.callback(VERIFY_EXERCISE_NO, VERIFY_EXERCISE_NO_CALLBACK)]
])
