import { Context, Telegraf } from "telegraf";
import { FamilyType, setUpKeyboardIteration } from "../../utils";
import { ViewFamilyMembersInlineKeybaordNotWorking } from "./viewFamilyMembersKeyboard";
import { deleteBotMessage } from "../../../../userState";
import { FamilyQueryFetch } from "../../../../database/queries/familyQueries";

export class ViewFamiliesCallbackHandler {
  async getMethod(ctx: Context, bot: Telegraf) {
    await deleteBotMessage(ctx);
    const responseData = await FamilyQueryFetch.getFamilyMemberByFamliyId(
      ctx.from!.id,
    );
    const response = new ViewFamilyMembersInlineKeybaordNotWorking(
      "getMethod",
      responseData,
    );
    return await setUpKeyboardIteration(ctx, response, bot, {
      callbackManualPattern: FamilyType.MEMBER,
    });
  }
}
