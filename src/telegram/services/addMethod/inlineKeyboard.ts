import { Context } from "telegraf";
import { MessageTemplate } from "../../../template/message";
import { verifyExerciseOutput } from "../utils";
import { InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram";
import { PartialWorkout } from "../../../model/workout";
import { userState } from "../../../userState"; import { onTransaction } from "../../../database/dataAccessLayer";
import { EXERCISE_NOT_SUCCESFULLY_CREATED, EXERCISE_SUCCESFULLY_CREATED } from "./messages";
import { inlineKeyboardMenu } from "../../mainMenu/inlineKeyboard";
import { ExerciseVerificationCallbacks, ExerciseVerificationLabels } from "./models";
import { ExerciseQueryPost } from "./queries";

export class ExercisePostVerificationHandler extends MessageTemplate {
  constructor(private ctx: Context) {
    super()
  }
  workoutData: PartialWorkout = userState[this.ctx.from!.id]
  protected prepareMessage() {
    const message = verifyExerciseOutput(this.workoutData)
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
    this.ctx.deleteMessage(message.message_id)
    const handlers: { [key: string]: () => Promise<void> } = {
      [ExerciseVerificationCallbacks.YES]: this.handleYesCallback.bind(this, this.ctx),
      [ExerciseVerificationCallbacks.NO]: this.handleNoCallback.bind(this, this.ctx)
    }
    if (handlers[action]) {
      return handlers[action]()
    }
  }
  private async handleYesCallback(_: Context) {
    const workoutData: PartialWorkout = userState[this.ctx.from!.id];
    await onTransaction(async (transactionWorkout) => {
      await ExerciseQueryPost.ExercisePost(workoutData, this.ctx, transactionWorkout);
    });
    await this.ctx.reply(EXERCISE_SUCCESFULLY_CREATED, {
      parse_mode: 'MarkdownV2',
      ...inlineKeyboardMenu
    });
  }
  private async handleNoCallback(ctx: Context) {
    await ctx.reply(EXERCISE_NOT_SUCCESFULLY_CREATED, {
      parse_mode: 'MarkdownV2',
      ...inlineKeyboardMenu
    });
  }
}


