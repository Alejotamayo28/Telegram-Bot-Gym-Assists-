import { Context, Telegraf } from "telegraf";
import { MessageTemplate } from "../../../template/message";
import { verifyExerciseOutput } from "../utils";
import { InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram";
import { PartialWorkout } from "../../../model/workout";
import { userState } from "../../../userState"; import { onTransaction } from "../../../database/dataAccessLayer";
import { ExerciseVerificationCallbacks, ExerciseVerificationLabels } from "./models";
import { ExerciseQueryPost } from "./queries";
import { returnMainMenuPage } from "../../mainMenu";

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
  async handleOptions(_: Context, message: Message, action: string, bot: Telegraf) {
    this.ctx.deleteMessage(message.message_id)
    const handlers: { [key: string]: () => Promise<void> } = {
      [ExerciseVerificationCallbacks.YES]: this.handleYesCallback.bind(this, bot),
      [ExerciseVerificationCallbacks.NO]: this.handleNoCallback.bind(this, bot)
    }
    if (handlers[action]) {
      return handlers[action]()
    }
  }
  private async handleYesCallback(bot: Telegraf) {
    const workoutData: PartialWorkout = userState[this.ctx.from!.id];
    await onTransaction(async (transactionWorkout) => {
      await ExerciseQueryPost.ExercisePost(workoutData, this.ctx, transactionWorkout);
    });
    returnMainMenuPage(this.ctx, bot)
  }
  private async handleNoCallback(bot: Telegraf) {
    returnMainMenuPage(this.ctx, bot)
  }
}


