import { Markup } from "telegraf";
import { ARNOLDS_SPLIT_BUTTON, BRO_SPLIT_BUTTON, FULL_BODY_BUTTON, PUSH_PULL_LEGS_BUTTON, RECOMMENDED_SPLITS_BUTTON, SPLIT_DEFINITION_BUTTON, SPLIT_DEFINITION_CALLBACK, UPPER_LOWWER_BUTTON, RECOMMENDED_SPLITS_CALLBACK, PUSH_PULL_LEGS_CALLBACK, FULL_BODY_CALLBACK, UPPER_LOWER_CALLBACK, ARNOLDS_SPLIT_CALLBACK, BRO_SPLIT_CALLBACK } from "../buttons/splitButtons";

export const splitWorkoutButtons = Markup.inlineKeyboard([
  [Markup.button.callback(`📚 ${SPLIT_DEFINITION_BUTTON}`, SPLIT_DEFINITION_CALLBACK)],
  [Markup.button.callback(`👨‍🏫 ${RECOMMENDED_SPLITS_BUTTON}`, RECOMMENDED_SPLITS_CALLBACK)]
])

export const splitsButton = Markup.inlineKeyboard([
  [
    Markup.button.callback(`💪🦵 ${PUSH_PULL_LEGS_BUTTON}`, PUSH_PULL_LEGS_CALLBACK),
    Markup.button.callback(`🏋️ ${FULL_BODY_BUTTON}`, FULL_BODY_CALLBACK)
  ],
  [
    Markup.button.callback(`🔼🔽 ${UPPER_LOWWER_BUTTON}`, UPPER_LOWER_CALLBACK),
    Markup.button.callback(`🏆 ${ARNOLDS_SPLIT_BUTTON}`, ARNOLDS_SPLIT_CALLBACK)
  ],
  [Markup.button.callback(`🦾 ${BRO_SPLIT_BUTTON}`, BRO_SPLIT_CALLBACK)],
])


export const menuPrincipalSplits = Markup.inlineKeyboard([
  [Markup.button.callback(`Menu principal`, `menu_principal`),
  Markup.button.callback(`menu Split`, `splitWorkout`)]
])


