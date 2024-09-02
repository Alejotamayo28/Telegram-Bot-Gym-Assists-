import { Context } from "telegraf";
import { errorMessageCtx, errorState } from "../bot/functions";

export function withTimeout<T>(promise: Promise<T>): Promise<T> {
  const TIME_OUT = 5000
  const timeOutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out')), TIME_OUT));
  return Promise.race([promise, timeOutPromise]);
}

export const handleError = async (error: unknown, stage: string, ctx: Context) => {
  if (error instanceof Error) {
    await errorState(error, stage, ctx);
  } else {
    console.error('Unknown Error', error);
    await ctx.reply(errorMessageCtx);
  }
}
