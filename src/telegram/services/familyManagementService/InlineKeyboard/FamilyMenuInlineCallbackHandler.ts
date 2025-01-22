import { Context, Telegraf } from "telegraf";
import { FamilyType, setUpKeyboardIteration } from "../../utils";
import { ViewFamilyInlineKeyboard } from "./viewFamiliesKeyboard";
import { FamilyQueryFetch } from "../../../../database/queries/familyQueries";
import { BotUtils } from "../../../../utils/botUtils";
import { BotStage, updateUserStage } from "../../../../userState";
import { botMessages } from "../../../messages";

export class FamilyMenuCallbackHandler {
  constructor(private ctx: Context) { }
  async handleViewFamilies(bot: Telegraf) {
    const responseData = await FamilyQueryFetch.getFamiliesByUserId(
      this.ctx.from!.id,
    );
    const response = new ViewFamilyInlineKeyboard("getMethod", responseData);
    return await setUpKeyboardIteration(this.ctx, response, bot, {
      callbackManualPattern: FamilyType.FAMILY,
    });
  }
  async handleJoinFamily() {
    await BotUtils.sendBotMessage(
      this.ctx,
      botMessages.inputRequest.prompts.familyMethod.enterFamilyName,
    );
    updateUserStage(this.ctx.from!.id, BotStage.PostFamily.JOIN_FAMILY_NAME);
  }
  async handleCreateFamily() {
    await BotUtils.sendBotMessage(
      this.ctx,
      botMessages.inputRequest.prompts.familyMethod.createFamilyName,
    );
    updateUserStage(this.ctx.from!.id, BotStage.PostFamily.NAME);
  }
}
