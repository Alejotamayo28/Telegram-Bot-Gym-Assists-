import { Context, Telegraf } from "telegraf";
import { MessageTemplate } from "../../../template/message";
import { verifyExerciseOutput } from "../utils";
import { InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram";
import { PartialWorkout } from "../../../model/workout";
import { deleteBotMessage, deleteUserMessage, getUserExercise, userState } from "../../../userState"; import { onTransaction } from "../../../database/dataAccessLayer";
import { ExerciseVerificationCallbacks, ExerciseVerificationLabels } from "./models";
import { ExerciseQueryPost } from "./queries";
import { redirectToMainMenuWithTaskDone } from "../../mainMenu";
import { botMessages } from "../../messages";

export class ExercisePostVerificationHandler extends MessageTemplate {
  constructor(private ctx: Context) {
    super()
  }
  //
  workoutData = getUserExercise(this.ctx.from!.id)
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
  async handleOptions(_: Context, __: Message, action: string, bot: Telegraf) {
    await deleteBotMessage(this.ctx)
    const handlers: { [key: string]: () => Promise<void> } = {
      [ExerciseVerificationCallbacks.YES]: this.handleYesCallback.bind(this, bot),
      [ExerciseVerificationCallbacks.NO]: this.handleNoCallback.bind(this, bot)
    }
    if (handlers[action]) {
      return handlers[action]()
    }
  }
  private async handleResponseCallback(bot: Telegraf, message: string) {
    try {
      await redirectToMainMenuWithTaskDone(this.ctx, bot, message)
    } catch (error) {
      console.error(`Error: `, error)
    }
  }
  private async handleYesCallback(bot: Telegraf) {
    const workoutData=getUserExercise(this.ctx.from!.id)
    await onTransaction(async (transactionWorkout) => {
      await ExerciseQueryPost.ExercisePost(workoutData, this.ctx, transactionWorkout);
    });
    await this.handleResponseCallback(bot, botMessages.inputRequest.prompts.postMethod.successful)
  }
  private async handleNoCallback(bot: Telegraf) {
    await this.handleResponseCallback(bot, botMessages.inputRequest.prompts.postMethod.notSuccessful)
  }
}


