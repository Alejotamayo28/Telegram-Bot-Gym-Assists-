import { Context, Telegraf } from "telegraf";
import { ExerciseUpdateTemplate, MessageTemplate } from "../../../template/message";
import { userStagePutExercise, userState, userStateUpdateDay, userStateUpdateKg, userStateUpdateName, userStateUpdateReps } from "../../../userState";
import { UPDATE_EXERCIISE_CANCELED, UPDATE_EXERCISE_KG, UPDATE_EXERCISE_NAME, UPDATE_EXERCISE_REPS, UPDATED_EXERCISE_SUCCESFULLY } from "./message";
import { InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram";
import { PartialWorkout } from "../../../model/workout";
import { ExerciseVerificationCallbacks, ExerciseVerificationLabels } from "../addMethod/models";
import { verifyExerciseOutput } from "../utils";
import { onTransaction } from "../../../database/dataAccessLayer";
import { workoutUpdateQuery } from "./queries";
import { returnMainMenuPage } from "../../mainMenu";

export class ExerciseUpdateDayHandler extends ExerciseUpdateTemplate {
  protected updateUserState(ctx: Context, message: string): void {
    userStateUpdateDay(ctx, message, userStagePutExercise.PUT_EXERCISE_NAME)
  }
  protected replyMessage(): string {
    return UPDATE_EXERCISE_NAME
  }
}

export class ExerciseUpdateNameHandler extends ExerciseUpdateTemplate {
  protected updateUserState(ctx: Context, message: string): void {
    userStateUpdateName(ctx, message, userStagePutExercise.PUT_EXERCISE_REPS)
  }
  protected replyMessage(): string {
    return UPDATE_EXERCISE_REPS
  }
}

export class ExerciseUpdateRepsHandler extends ExerciseUpdateTemplate {
  protected updateUserState(ctx: Context, message: string): void {
    const reps = message.split(" ").map(Number)
    userStateUpdateReps(ctx, reps, userStagePutExercise.PUT_EXERCISE_WEIGHT)
  }
  protected replyMessage(): string {
    return UPDATE_EXERCISE_KG
  }
}

export class ExerciseUpdateKgHandler extends ExerciseUpdateTemplate {
  protected updateUserState(ctx: Context, message: string): void {
    userStateUpdateKg(ctx, Number(message))
  }
  protected replyMessage(): string {
    return `Cambios guardados, continua...`
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
  private async handleYesCallback(ctx: Context, bot: Telegraf) {
    await onTransaction(async (clientTransaction) => {
      await workoutUpdateQuery(ctx, this.workoutData, clientTransaction)
    })
    await returnMainMenuPage(ctx, bot)
  }
  private async handleNoCallback(ctx: Context, bot: Telegraf) {
    await returnMainMenuPage(ctx, bot)
  }
}



