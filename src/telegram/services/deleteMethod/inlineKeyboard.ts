import { Context, Telegraf } from "telegraf";
import { PartialWorkout } from "../../../model/workout";
import { userState } from "../../../userState";
import { verifyDeleteExercise } from "../utils";
import { InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram";
import { MessageTemplate } from "../../../template/message";
import { ExerciseVerificationCallbacks, ExerciseVerificationLabels } from "../addMethod/models";
import { onTransaction } from "../../../database/dataAccessLayer";
import { ExerciseQueryDelete } from "./queries";
import { returnMainMenuPage } from "../../mainMenu";

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
  async handleOptions(_: Context, message: Message, action: string, bot: Telegraf) {
    const handlers: { [key: string]: () => Promise<void> } = {
      [ExerciseVerificationCallbacks.YES]: this.handleYesCallback.bind(this, bot),
      [ExerciseVerificationCallbacks.NO]: this.handleNoCallback.bind(this, bot)
    }
    if (handlers[action]) {
      return handlers[action]()
    }
  }
  private async handleYesCallback(bot: Telegraf) {
    await onTransaction(async (transactionWorkout) => {
      await ExerciseQueryDelete.ExerciseDelete(this.ctx, userState[this.ctx.from!.id], transactionWorkout)
    })
    await returnMainMenuPage(this.ctx, bot)
  }
  private async handleNoCallback(bot: Telegraf) {
    await returnMainMenuPage(this.ctx, bot)
  }
}

