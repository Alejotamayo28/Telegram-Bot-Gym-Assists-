import { Context, Markup, Telegraf } from "telegraf";
import { VERIFY_EXERCISE_UPDATE_YES, VERIFY_EXERCISE_UPDATE_YES_CALLBACK } from "./buttons";
import { VERIFY_EXERCISE_NO, VERIFY_EXERCISE_NO_CALLBACK, VERIFY_EXERCISE_YES } from "../addMethod/buttons";
import { ExerciseUpdateTemplate, MessageTemplate } from "../../../template/message";
import { userStagePutExercise, userStateUpdateDay, userStateUpdateKg, userStateUpdateName, userStateUpdateReps } from "../../../userState";
import { UPDATE_EXERCISE_KG, UPDATE_EXERCISE_NAME, UPDATE_EXERCISE_REPS } from "./message";
import { InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram";
import { PostExerciseVerificationController } from "../addMethod";

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
  protected prepareMessage() {
    const message = ''
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(VERIFY_EXERCISE_UPDATE_YES, {
            action: VERIFY_EXERCISE_YES
          })
        ]
        ,
        [this.createButton(VERIFY_EXERCISE_NO, {
          action:
            VERIFY_EXERCISE_NO_CALLBACK
        })
        ]
      ]
    }
    return {message, keyboard}
  }
  protected async handleOptions(ctx: Context, message: Message, action: string, bot: Telegraf, userMessage?: string) {
    
  }
}


export const inlineKeyboardVerifyExerciseUpdate = Markup.inlineKeyboard([
  [Markup.button.callback(VERIFY_EXERCISE_UPDATE_YES, VERIFY_EXERCISE_UPDATE_YES_CALLBACK),
  Markup.button.callback(VERIFY_EXERCISE_NO, VERIFY_EXERCISE_NO_CALLBACK)]
])
