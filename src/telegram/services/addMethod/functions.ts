import { Context } from "telegraf"
import { deleteUserMessage, userMessageTest, userStagePostExercise, userStateUpdateDay, userStateUpdateKg, userStateUpdateName, userStateUpdateReps } from "../../../userState"
import { EXERCISE_NAME_OUTPUT, EXERCISE_REPS_OUTPUT, EXERCISE_WEIGHT_OUTPUT } from "./messages"


export class ExercisePostHandler {
  static async postExerciseDay(ctx: Context, day: string): Promise<void> {
    userStateUpdateDay(ctx, day, userStagePostExercise.POST_EXERCISE_NAME)
    await deleteUserMessage(ctx)
    await ctx.reply(EXERCISE_NAME_OUTPUT, {
      parse_mode: "MarkdownV2"
    })
  }
  static async postExerciseName(ctx: Context, name: string): Promise<void> {
    userStateUpdateName(ctx, name, userStagePostExercise.POST_EXERCISE_REPS)
    await deleteUserMessage(ctx)
    await ctx.reply(EXERCISE_REPS_OUTPUT, {
      parse_mode: "MarkdownV2"
    })
  }
  static async postExerciseReps(ctx: Context, userMessage: string): Promise<void> {
    const reps = userMessage.split(" ").map(Number)
    userStateUpdateReps(ctx, reps, userStagePostExercise.POST_EXERCISE_VERIFICATION)
    await deleteUserMessage(ctx)
    await ctx.reply(EXERCISE_WEIGHT_OUTPUT, {
      parse_mode: "MarkdownV2"
    })
  }
  static async postExerciseWeight(ctx: Context, weight: number): Promise<void> {
    userStateUpdateKg(ctx, weight)
    await deleteUserMessage(ctx)
  }
}



