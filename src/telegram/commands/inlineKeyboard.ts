import { Markup } from "telegraf";
import { SIGN_UP_BUTTON, SIGN_UP_CALLBACK, SIGN_UP_EXAMPLE_BUTTON, SIGN_UP_EXAMPLE_CALLBACK } from "../services/singUp/buttons";
import { LOGIN_BUTTON, LOGIN_CALLBACK, LOGIN_EXAMPLE_BUTTON, LOGIN_EXAMPLE_CALLBACK } from "../services/login/buttons";

export const startInlineKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback(LOGIN_BUTTON, LOGIN_CALLBACK),
  Markup.button.callback(SIGN_UP_BUTTON, SIGN_UP_CALLBACK)],
  [Markup.button.callback(LOGIN_EXAMPLE_BUTTON, LOGIN_EXAMPLE_CALLBACK),
  Markup.button.callback(SIGN_UP_EXAMPLE_BUTTON, SIGN_UP_EXAMPLE_CALLBACK)],
])





