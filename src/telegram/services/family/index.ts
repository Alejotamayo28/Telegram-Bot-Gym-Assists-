import { Context, Telegraf } from "telegraf"
import { saveBotMessage } from "../../../userState"
import { handleKeyboardStep, handleKeyboardStepTest, regexPattern, tryCatch } from "../utils"
import { FamilyInlineKeyboard, ViewFamilyInlineKeyboard} from "./inlineKeyboard"
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
    //Queries
    //Classes
    const familiesMenu = new FamilyInlineKeyboard(ctx)
    // const familiesView = new ViewFamilyInlineKeyboard("getMethod", await familiesDataQuery(ctx))
    //const familiesViewMembers = new ViewFamilyMembersInlineKeybaord("getMethod", await familiesMembersDataQuery(ctx))
    //Flow
    await handleKeyboardStepTest(ctx, familiesMenu, bot, { callbackPattern: regexPattern(FamilyInlinekeyboardAction) })
    /* await handleKeyboardStepTest(ctx, familiesMenu, bot, {
       nextStep: async () => {
         await handleKeyboardStepTest(ctx, familiesView, bot, { nextStep: async () => {
             await handleKeyboardStepTest(ctx, familiesViewMembers, bot)
           }
         })
       }
     })
     */
  } catch (error) {
    console.error(`Error: `, error)
  }
}










