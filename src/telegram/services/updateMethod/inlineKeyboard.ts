import { Context, Telegraf } from "telegraf";
import { MessageTemplate } from "../../../template/message";
import { userState, } from "../../../userState";
import { InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram";
import { PartialWorkout } from "../../../model/workout";
import { ExerciseVerificationCallbacks, ExerciseVerificationLabels } from "../addMethod/models";
import { verifyExerciseOutput } from "../utils";
import { onTransaction } from "../../../database/dataAccessLayer";
import { workoutUpdateQuery } from "./queries";
import { redirectToMainMenuWithTaskDone } from "../../mainMenu";










export class ExerciseUpdateVerificationHandler extends MessageTemplate {
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
  async handleOptions(ctx: Context, message: Message, action: string, bot: Telegraf) {
    this.ctx.deleteMessage(message.message_id)
    const handlers: { [key: string]: () => Promise<void> } = {
      [ExerciseVerificationCallbacks.YES]: this.handleYesCallback.bind(this, this.ctx, bot),
      [ExerciseVerificationCallbacks.NO]: this.handleNoCallback.bind(this, this.ctx, bot)
    }
    if (handlers[action]) {
      return handlers[action]()
    }
  }
  private async handleResponseCallback(bot: Telegraf, message: string) {
    await redirectToMainMenuWithTaskDone(this.ctx, bot, message)
  }
  private async handleYesCallback(ctx: Context, bot: Telegraf) {
    await onTransaction(async (clientTransaction) => {
      await workoutUpdateQuery(ctx, this.workoutData, clientTransaction)
    })
    await this.handleResponseCallback(bot,
      `*Ejercicio actualizado* \n\n_El ejercicio ha sido actualizado exitosamente._`)
  }
  private async handleNoCallback(ctx: Context, bot: Telegraf) {
    await this.handleResponseCallback(bot,
      `*Actualizacion cancelada* \n\n_La accion ha sido cancelada exitosamente._`)
  }
}



