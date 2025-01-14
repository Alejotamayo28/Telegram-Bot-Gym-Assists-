import { Context, Telegraf } from "telegraf";
import { deleteBotMessage, Exercise, getUserExercise } from "../../../userState";
import { verifyDeleteExercise } from "../utils";
import { InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram";
import { MessageTemplate } from "../../../template/message";
import { ExerciseVerificationCallbacks, ExerciseVerificationLabels } from "../addMethod/models";
import { onTransaction } from "../../../database/dataAccessLayer";
import { ExerciseQueryDelete } from "./queries";
import { mainMenuPage } from "../../mainMenu";

export class ExerciseDeleteVerificationHandler extends MessageTemplate {
  constructor(private ctx: Context) {
    super()
  }
  workoutData: Exercise = getUserExercise(this.ctx.from!.id)
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
  async handleOptions(ctx: Context, message: Message, action: string, bot: Telegraf) {
    await deleteBotMessage(ctx)
    const handlers: { [key: string]: () => Promise<void> } = {
      [ExerciseVerificationCallbacks.YES]: this.handleYesCallback.bind(this, bot),
      [ExerciseVerificationCallbacks.NO]: this.handleNoCallback.bind(this, bot)
    }
    if (handlers[action]) {
      return handlers[action]()
    }
  }
  private async handleResponeCallback(bot: Telegraf, message: string) {
    await mainMenuPage(this.ctx, bot, message)
  }
  private async handleYesCallback(bot: Telegraf) {
    await onTransaction(async (transactionWorkout) => {
      await ExerciseQueryDelete.ExerciseDelete(this.ctx, transactionWorkout)
    })
    await this.handleResponeCallback(bot,
      `*Ejercicio eliminado* ❌ \n\n_El ejercicio ha sido agregado exitosamente._`)
  }
  private async handleNoCallback(bot: Telegraf) {
    await this.handleResponeCallback(bot,
      `*Eliminación cancelada* ❌ \n\n_La acción ha sido cancelada exitosamente._`)
  }
}

