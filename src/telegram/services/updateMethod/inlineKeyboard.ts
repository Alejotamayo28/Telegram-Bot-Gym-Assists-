import { Context } from "telegraf";
import { ExerciseUpdateTemplate, MessageTemplate } from "../../../template/message";
import { userStagePutExercise, userState, userStateUpdateDay, userStateUpdateKg, userStateUpdateName, userStateUpdateReps } from "../../../userState";
import { UPDATE_EXERCIISE_CANCELED, UPDATE_EXERCISE_KG, UPDATE_EXERCISE_NAME, UPDATE_EXERCISE_REPS, UPDATED_EXERCISE_SUCCESFULLY } from "./message";
import { InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram";
import { PartialWorkout } from "../../../model/workout";
import { ExerciseVerificationCallbacks, ExerciseVerificationLabels } from "../addMethod/models";
import { verifyExerciseOutput } from "../utils";
import { onTransaction } from "../../../database/dataAccessLayer";
import { workoutUpdateQuery } from "./queries";
import { inlineKeyboardMenu } from "../../mainMenu/inlineKeyboard";

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
  protected async handleOptions(ctx: Context, message: Message, action: string) {
    this.ctx.deleteMessage(message.message_id)
    const handlers: { [key: string]: () => Promise<void> } = {
      [ExerciseVerificationCallbacks.YES]: this.handleYesCallback.bind(this, this.ctx),
      [ExerciseVerificationCallbacks.NO]: this.handleNoCallback.bind(this, this.ctx)
    }
  }
  private async handleYesCallback(ctx: Context) {
    await onTransaction(async (clientTransaction) => {
      await workoutUpdateQuery(ctx, this.workoutData, clientTransaction)
    })
    await ctx.reply(UPDATED_EXERCISE_SUCCESFULLY, {
      parse_mode: 'MarkdownV2',
      reply_markup: inlineKeyboardMenu.reply_markup
    })
  }
  private async handleNoCallback(ctx: Context) {
    await ctx.reply(UPDATE_EXERCIISE_CANCELED, {
      parse_mode: "Markdown",
      reply_markup: inlineKeyboardMenu.reply_markup
    })
  }
}



