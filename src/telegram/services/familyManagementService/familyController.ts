import { Context, Telegraf } from "telegraf";
import { saveBotMessage } from "../../../userState";
import { regexPattern, setUpKeyboardIteration, tryCatch } from "../utils";
import { FamilyInlineKeyboard } from "./InlineKeyboard/FamilyMenuInlineKeyboard";
import { FamilyMenuModel } from "../../../model/familyMenuModel";
import { mainMenuModel } from "../../../model/mainMenuModel";

export const familyInlinekeyboardController = async (
  ctx: Context,
  bot: Telegraf,
) => {
  const response = new FamilyInlineKeyboard(ctx);
  try {
    const message = await response.sendCompleteMessage(ctx);
    await saveBotMessage(ctx, message.message_id);
    bot.action(regexPattern(FamilyMenuModel.Callback), async (ctx) => {
      const action = ctx.match[0];
      await tryCatch(
        () => response.handleOptions(ctx, message, action, bot),
        ctx,
      );
    });
  } catch (error) {
    console.error(`Error: `, error);
  }
};

// Flow: FamiliesMenu -> ViewFamiliesYouIn -> ViewFamiliesMembers
export const FamilyFlow = async (ctx: Context, bot: Telegraf) => {
  try {
    const familiesMenu = new FamilyInlineKeyboard(ctx);
    await setUpKeyboardIteration(ctx, familiesMenu, bot, {
      callbackPattern: regexPattern(mainMenuModel.Callback),
    });
  } catch (error) {
    console.error(`Error: `, error);
  }
};
