import { Context, Telegraf } from "telegraf"
import { saveBotMessage } from "../../../userState"
import { regexPattern, setUpKeyboardIteration, tryCatch } from "../utils"
import { FamilyInlineKeyboard } from "./inlineKeyboard"
import { FamilyInlinekeyboardAction } from "./models"
import { FamilyQueries } from "./queries"

export const familyInlinekeyboardController = async (ctx: Context, bot: Telegraf) => {
  const response = new FamilyInlineKeyboard(ctx)
  try {
    const message = await response.sendCompleteMessage(ctx)
    await saveBotMessage(ctx, message.message_id)
    bot.action(regexPattern(FamilyInlinekeyboardAction), async (ctx) => {
      const action = ctx.match[0]
      await tryCatch(() => response.handleOptions(ctx, message, action, bot), ctx)
    })
  } catch (error) {
    console.error(`Error: `, error)
  }
}
export const familiesDataQuery = async (ctx: Context) => {
  const response = await FamilyQueries.getFamiliesById(ctx.from!.id)
  return response
}
export const familiesMembersDataQuery = async (ctx: Context) => {
  const response = await FamilyQueries.getFamiliesMemberById(ctx.from!.id)
  return response
}

// Flow: FamiliesMenu -> ViewFamiliesYouIn -> ViewFamiliesMembers
export const FamilyFlow = async (ctx: Context, bot: Telegraf) => {
  try {
    const familiesMenu = new FamilyInlineKeyboard(ctx)
    await setUpKeyboardIteration(ctx, familiesMenu, bot, { callbackPattern: regexPattern(FamilyInlinekeyboardAction) })
  } catch (error) {
    console.error(`Error: `, error)
  }
}










