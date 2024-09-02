import { Markup } from "telegraf";
import { VERIFY_EXERCISE_UPDATE_YES, VERIFY_EXERCISE_UPDATE_YES_CALLBACK } from "./buttons";
import { VERIFY_EXERCISE_NO, VERIFY_EXERCISE_NO_CALLBACK } from "../addMethod/buttons";

export const inlineKeyboardVerifyExerciseUpdate = Markup.inlineKeyboard([
  [Markup.button.callback(VERIFY_EXERCISE_UPDATE_YES, VERIFY_EXERCISE_UPDATE_YES_CALLBACK),
  Markup.button.callback(VERIFY_EXERCISE_NO, VERIFY_EXERCISE_NO_CALLBACK)]
])
