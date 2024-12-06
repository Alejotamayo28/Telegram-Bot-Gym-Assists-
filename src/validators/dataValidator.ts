import { Context } from "telegraf";
import { validateDays, validateExercises, validateMonths } from "./allowedValues";
import { isNaN, parseInt } from "lodash"
import { deleteUserMessage } from "../userState";
import { botMessages } from "../telegram/messages";
import { BotUtils } from "../telegram/services/singUp/functions";

export class DataValidator {
  private static async handleDataValidatorError(ctx: Context, errorType: keyof typeof botMessages.inputRequest.validation) {
    const errorMessage = botMessages.inputRequest.validation[errorType]
    await BotUtils.sendBotMessage(ctx, errorMessage)
  }
  static async validateMonth(ctx: Context, userMessage: string): Promise<boolean> {
    if (!(this.isValidMonth(userMessage.toLowerCase()))) {
      await this.handleDataValidatorError(ctx, "invalidMonth")
      return true
    }
    return false
  }
  static async validateDay(ctx: Context, userMessage: string): Promise<boolean> {
    if (!this.isValidDay(userMessage.toLowerCase())) {
      await deleteUserMessage(ctx)
      await this.handleDataValidatorError(ctx, "invalidDay")
      return true
    }
    return false
  }
  static async validateExercise(ctx: Context, userMessage: string): Promise<boolean> {
    if (!this.isValidExercise(userMessage)) {
      await deleteUserMessage(ctx)
      await this.handleDataValidatorError(ctx, "invalidExerciseName")
      return true
    }
    return false
  }
  static async validateReps(ctx: Context, userMessage: string): Promise<boolean> {
    const reps = userMessage.split(" ").map(Number)
    if (!this.isValidReps(reps)) {
      await deleteUserMessage(ctx)
      await this.handleDataValidatorError(ctx, "invalidExerciseReps")
      return true
    }
    return false
  }
  static async validateWeight(ctx: Context, userMessage: string): Promise<boolean> {
    const weight = parseInt(userMessage)
    if (isNaN(weight)) {
      await deleteUserMessage(ctx)
      await this.handleDataValidatorError(ctx, "invalidExerciseWeight")
      return true
    }
    return false
  }
  static async validateWeek(ctx: Context, userMessage: string): Promise<boolean> {
    const week = parseInt(userMessage)
    if (isNaN(week)) {
      await deleteUserMessage(ctx)
      await this.handleDataValidatorError(ctx, "invalidExericseWeek")
      return true
    }
    return false
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

