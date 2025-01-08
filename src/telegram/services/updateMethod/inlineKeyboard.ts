import { Context, Telegraf } from "telegraf";
import { CallbackData, MessageTemplate } from "../../../template/message";
import { UpdateUserStateOptions, userState, userStateUpdateExercisesId, userStateUpdateMessagesId } from "../../../userState";
import { InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram";
import { Exercise, PartialWorkout } from "../../../model/workout";
import { ExerciseVerificationCallbacks, ExerciseVerificationLabels } from "../addMethod/models";
import { exercisesMethod, groupedButtonsFunction, verifyExerciseOutput } from "../utils";
import { onTransaction } from "../../../database/dataAccessLayer";
import { workoutUpdateQuery } from "./queries";
import { redirectToMainMenuWithTaskDone } from "../../mainMenu";
import { ExerciseQueryDelete } from "../deleteMethod/queries";
import { ExerciseDeleteHandler } from "../deleteMethod/functions";
import { BotUtils } from "../singUp/functions";
import { botMessages } from "../../messages";

let response: number[] = []
let messagesId: number[] = []

export class ExerciseInlineKeybaord extends MessageTemplate {
  private selectedOption!: (ctx: Context, bot: Telegraf) => Promise<void>
  constructor(private method: keyof typeof exercisesMethod, private messagge: string, private data: Exercise[]) {
    super()
    this.selectedOption = this.options[this.method]
  }
  protected prepareMessage() {
    const groupedButtons = groupedButtonsFunction(this.data)
    const message = this.messagge
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: groupedButtons
    }
    return { message, keyboard }
  } async handleOptions(ctx: Context, message: Message, action: string, bot: Telegraf): Promise<void> {
    const handlers: { [key: string]: () => Promise<any> } = {}
    this.data.forEach(exercise => {
      handlers[exercise.id] = async () => {
        const message = await ctx.reply(
          `Has seleccionado el ejercicio: ${exercise.name}, con el id: ${exercise.id}`)
        messagesId.push(message.message_id)
        response.push(exercise.id)
        userStateUpdateMessagesId(ctx, messagesId)
        userStateUpdateExercisesId(ctx, response)
      }
    })
    if (action == `continuar`) {
      const { messagesId }: UpdateUserStateOptions = userState[ctx.from!.id]
      messagesId?.forEach((i: number) => {
        ctx.deleteMessage(i)
      })
      userState[ctx.from!.id].messagesId = []
      await ctx.deleteMessage(message.message_id)
      return this.options[this.method](ctx, bot)
    }
    if (handlers[action]) {
      return handlers[action]()
    }
  }
  private options: { [key in keyof typeof exercisesMethod]: (ctx: Context, bot: Telegraf) => Promise<void> } = {
    deleteMethod: async (ctx: Context, bot: Telegraf): Promise<void> => {
      console.log(userState[ctx.from!.id].exercisesId)
      // falta el boton cancelar
      const data = await ExerciseQueryDelete.DeleteSelectedExercises(ctx)
      const mappedData = await ExerciseDeleteHandler.getDeletedExercisesMap(ctx, data)
      await BotUtils.sendBotMessage(ctx, mappedData)
      return await redirectToMainMenuWithTaskDone(ctx, bot, botMessages.inputRequest.prompts.deleteMethod.successfull)
    },
    getMethod: async (): Promise<void> => {

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
      `* Ejercicio actualizado * \n\n_El ejercicio ha sido actualizado exitosamente._`)
  }
  private async handleNoCallback(ctx: Context, bot: Telegraf) {
    await this.handleResponseCallback(bot,
      `* Actualizacion cancelada * \n\n_La accion ha sido cancelada exitosamente._`)
  }
}



