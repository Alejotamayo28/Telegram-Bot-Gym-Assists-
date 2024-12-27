import { Context, Telegraf } from "telegraf";
import { MessageTemplate } from "../../../template/message";
import { deleteBotMessage, userState, } from "../../../userState";
import { InlineKeyboardButton, InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram";
import { Exercise, PartialWorkout } from "../../../model/workout";
import { ExerciseVerificationCallbacks, ExerciseVerificationLabels } from "../addMethod/models";
import { verifyExerciseOutput } from "../utils";
import { onTransaction } from "../../../database/dataAccessLayer";
import { workoutUpdateQuery } from "./queries";
import { redirectToMainMenuWithTaskDone } from "../../mainMenu";

export class ExerciseTesting extends MessageTemplate {
  constructor(private ctx: Context, private data: Exercise[]) { super() }
  protected prepareMessage() {
    const buttonsPerRow = 2;
    const groupedButtons = this.data.reduce((rows: InlineKeyboardButton[][], exercise: Exercise, index: number) => {
      const button = this.createButton(exercise.name, { action: `${exercise.id}` });
      if (index % buttonsPerRow === 0) {
        rows.push([button]);
      } else {
        rows[rows.length - 1].push(button);
      }
      return rows;
    }, []);
    const message = `_Se han encontrado los siguientes ejercicios en base a tus resultados:_`
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: groupedButtons
    }
    return { message, keyboard }
  }
  async handleOptions(_: Context, message: Message, action: string) {
    await deleteBotMessage(this.ctx)
    const handlers: { [key: string]: () => Promise<any> } = {}
    this.data.forEach(exercise => {
      handlers[exercise.id] = async () => {
        return await this.handleExerciseSelection(exercise)
      }
    })
    if (handlers[action]) {
      return handlers[action]()
    }
  }
  private async handleExerciseSelection(exercise: Exercise) {
    try {
      await this.ctx.reply(`Has seleccionado el ejercicio ${exercise.name} con el id: ${exercise.id}`)
      return exercise
    } catch (error) {
      console.error(`Error: `, error)
    }
  }
}

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



