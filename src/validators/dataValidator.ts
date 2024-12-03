import { Context } from "telegraf";
import { validateDays, validateExercises, validateMonths } from "./allowedValues";
import { isNaN, parseInt } from "lodash"
import { EXERCISE_NAME_OUTPUT_INVALID, EXERCISE_REPS_INVALID_OUTPUT, EXERCISE_WEEK_INVALID_OUTPUT, EXERCISE_WEIGHT_INVALID_OUTPUT, INCORRECT_DAY_INPUT } from "../telegram/services/addMethod/messages";
import { deleteUserMessage } from "../userState";
import { ExerciseQueryFetcher } from "../telegram/services/getMethod/queries";
import { onSession } from "../database/dataAccessLayer";
import { QueryResult } from "pg";
import { UserData } from "../model/client";

export class DataValidator {
  static async validateNicknameLogin(ctx: Context, userMessage: string): Promise<boolean> {
    if (!(await this.isValidNickname(ctx, userMessage))) {
      return false
    }
    return true
  }
  static async validateMonth(ctx: Context, userMessage: string): Promise<boolean> {
    if (!(this.isValidMonth(userMessage))) {
      await ctx.deleteMessage()
      await handleIncorrectMonthInput(ctx)
      return true
    }
    return false
  }
  static async validateDay(ctx: Context, userMessage: string): Promise<boolean> {
    if (!this.isValidDay(userMessage)) {
      deleteUserMessage(ctx)
      await handleIncorrectDayInput(ctx)
      return true
    }
    return false
  }
  static async validateExercise(ctx: Context, userMessage: string): Promise<boolean> {
    if (!this.isValidExercise(userMessage)) {
      await ctx.deleteMessage()
      await handleIncorrectExerciseInput(ctx)
      return true
    }
    return false
  }
  static async validateReps(ctx: Context, userMessage: string): Promise<boolean> {
    const reps = userMessage.split(" ").map(Number)
    if (!this.isValidReps(reps)) {
      await ctx.deleteMessage()
      await handleIncorrectRepsInput(ctx)
      return true
    }
    return false
  }
  static async validateWeight(ctx: Context, userMessage: string): Promise<boolean> {
    const weight = parseInt(userMessage)
    if (isNaN(weight)) {
      await ctx.deleteMessage()
      await handleIncorrectWeightInput(ctx)
      return true
    }
    return false
  }
  static async validateWeek(ctx: Context, userMessage: string): Promise<boolean> {
    const week = parseInt(userMessage)
    if (isNaN(week)) {
      await ctx.deleteMessage()
      await handleIncorrectWeekInput(ctx)
      return true
    }
    return false
  }
  private static async isValidNickname(ctx: Context, nickname: string): Promise<UserData[]> {
    const response = await onSession(async (clientTransaction) => {
      return clientTransaction.query(
        `SELECT nickname, password FROM client WHERE nickname = $1`,
        [nickname])
    })
    return response.rows
  }
  private static isValidMonth(monthInput: string): boolean {
    return validateMonths.includes(monthInput)
  }
  private static isValidDay(dayInput: string): boolean {
    return validateDays.includes(dayInput)
  }
  private static isValidExercise(exerciseInput: string): boolean {
    return validateExercises.includes(exerciseInput.toLowerCase())
  }
  private static isValidReps(reps: number[]): boolean {
    return reps.every(rep => !isNaN(rep))
  }
}

export const handleIncorrectMonthInput = async (ctx: Context): Promise<void> => {
  await ctx.reply(`mes incorrecto`, {
    parse_mode: "Markdown"
  })
}

export const handleIncorrectDayInput = async (ctx: Context): Promise<void> => {
  await ctx.reply(INCORRECT_DAY_INPUT, {
    parse_mode: 'Markdown'
  })
}

export const handleIncorrectExerciseInput = async (ctx: Context): Promise<void> => {
  await ctx.reply(EXERCISE_NAME_OUTPUT_INVALID, {
    parse_mode: "Markdown"
  })
}

export const handleIncorrectRepsInput = async (ctx: Context): Promise<void> => {
  await ctx.reply(EXERCISE_REPS_INVALID_OUTPUT, {
    parse_mode: "Markdown"
  })
}

export const handleIncorrectWeightInput = async (ctx: Context): Promise<void> => {
  await ctx.reply(EXERCISE_WEIGHT_INVALID_OUTPUT, {
    parse_mode: "Markdown"
  })
}

export const handleIncorrectWeekInput = async (ctx: Context): Promise<void> => {
  await ctx.reply(EXERCISE_WEEK_INVALID_OUTPUT, {
    parse_mode: "Markdown"
  })
}


