import { Markup } from "telegraf";
import {
  VERIFY_EXERCISE_NO, VERIFY_EXERCISE_NO_CALLBACK, VERIFY_EXERCISE_YES,
  VERIFY_EXERCISE_YES_CALLBACK
} from "./buttons";

export const inlineKeyboardVerifyExercise = Markup.inlineKeyboard([
  [Markup.button.callback(VERIFY_EXERCISE_YES, VERIFY_EXERCISE_YES_CALLBACK),
  Markup.button.callback(VERIFY_EXERCISE_NO, VERIFY_EXERCISE_NO_CALLBACK)]
])
