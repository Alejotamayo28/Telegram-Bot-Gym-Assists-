import { Context } from "telegraf";
import { PartialWorkout } from "../../../model/workout";
import { userState } from "../../../userState";
import { verifyDeleteExercise } from "../utils";
import { InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram";
import { MessageTemplate } from "../../../template/message";
import { ExerciseVerificationCallbacks, ExerciseVerificationLabels } from "../addMethod/models";
import { onTransaction } from "../../../database/dataAccessLayer";
import { ExerciseQueryDelete } from "./queries";
import { EXERCISE_DELETE_SUCCESFULLY, EXERCISE_NOT_DELETE_SUCCESFULLY } from "./messages";
import { inlineKeyboardMenu } from "../../mainMenu/inlineKeyboard";

export class ExerciseDeleteVerificationHandler extends MessageTemplate {
  constructor(private ctx: Context) {
    super()
  }
  workoutData: PartialWorkout = userState[this.ctx.from!.id]
  protected prepareMessage() {
    const message = verifyDeleteExercise(this.workoutData)
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(ExerciseVerificationLabels.YES, { action: ExerciseVerificationCallbacks.YES }),
          this.createButton(ExerciseVerificationLabels.NO, { action: ExerciseVerificationCallbacks.NO })
        ]
      ]
    }
    return { message, keyboard }
  }
  async handleOptions(_: Context, message: Message, action: string) {
    const handlers: { [key: string]: () => Promise<void> } = {
      [ExerciseVerificationCallbacks.YES]: this.handleYesCallback.bind(this, this.ctx),
      [ExerciseVerificationCallbacks.NO]: this.handleNoCallback.bind(this, this.ctx)
    }
    if (handlers[action]) {
      return handlers[action]()
    }
  }
  private async handleYesCallback(_: Context) {
    await onTransaction(async (transactionWorkout) => {
      await ExerciseQueryDelete.ExerciseDelete(this.ctx, userState[this.ctx.from!.id], transactionWorkout)
    })
    await this.ctx.reply(EXERCISE_DELETE_SUCCESFULLY, {
      parse_mode: "MarkdownV2",
      reply_markup: inlineKeyboardMenu.reply_markup
    })
  }
  private async handleNoCallback(_: Context) {
    await this.ctx.reply(EXERCISE_NOT_DELETE_SUCCESFULLY, {
      parse_mode: "MarkdownV2",
      reply_markup: inlineKeyboardMenu.reply_markup
    })
  }
}

