import { Context } from "telegraf"
import { BotStage, deleteUserMessage, getUserState, updateUserState, userStagePostExercise, userStateUpdateDay, userStateUpdateKg, userStateUpdateName, userStateUpdateReps } from "../../../userState"
import { botMessages } from "../../messages"
import { testingDataStructures } from "../singUp/functions"

export class ExercisePostHandler {
  static async postExerciseDay(ctx: Context, day: string): Promise<void> {
    userStateUpdateDay(ctx, day, userStagePostExercise.POST_EXERCISE_NAME)
    await deleteUserMessage(ctx)
    await ctx.reply(botMessages.inputRequest.prompts.postMethod.exerciseName, {
      parse_mode: "Markdown"
    })
  }
  static async postExerciseName(ctx: Context, name: string): Promise<void> {
    updateUserState(ctx.from!.id, {
      stage: BotStage.Exercise.CREATE_REPS,
      data: {
        exercise: {
          name: name
        }
      }
    })
    await deleteUserMessage(ctx)
    await ctx.reply(botMessages.inputRequest.prompts.postMethod.exerciseReps, {
      parse_mode: "Markdown"
    })
  }
  static async postExerciseReps(ctx: Context, userMessage: string): Promise<void> {
    const reps = userMessage.split(" ").map(Number)
    updateUserState(ctx.from!.id, {
      stage: BotStage.Exercise.CREATE_WEIGHT,
      data: {
        exercise: {
          reps: reps
        }
      }
    })
    await deleteUserMessage(ctx)
    await ctx.reply(botMessages.inputRequest.prompts.postMethod.exerciseWeight, {
      parse_mode: "Markdown"
    })
  }
  static async postExerciseWeight(ctx: Context, weight: number): Promise<void> {
    updateUserState(ctx.from!.id, {
      data: {
        exercise: {
          weight: weight
        }
      }
    })
    console.log(getUserState(ctx.from!.id))
    await deleteUserMessage(ctx)
  }
}



