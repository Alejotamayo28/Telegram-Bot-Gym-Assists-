import { Context } from "telegraf"
import { deleteUserMessage, userStagePostExercise, userStateUpdateDay, userStateUpdateKg, userStateUpdateName, userStateUpdateReps } from "../../../userState"
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
    userStateUpdateName(ctx, name, userStagePostExercise.POST_EXERCISE_REPS)
    await deleteUserMessage(ctx)
    await ctx.reply(botMessages.inputRequest.prompts.postMethod.exerciseReps, {
      parse_mode: "Markdown"
    })
  }
  static async postExerciseReps(ctx: Context, userMessage: string): Promise<void> {
    const reps = userMessage.split(" ").map(Number)
    userStateUpdateReps(ctx, reps, userStagePostExercise.POST_EXERCISE_VERIFICATION)
    await deleteUserMessage(ctx)
    await ctx.reply(botMessages.inputRequest.prompts.postMethod.exerciseWeight, {
      parse_mode: "Markdown"
    })
  }
  static async postExerciseWeight(ctx: Context, weight: number): Promise<void> {
    userStateUpdateKg(ctx, weight)
    await deleteUserMessage(ctx)
  }
}



