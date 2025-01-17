import { Context, Telegraf } from "telegraf";
import { ClientDataFormatter } from "../../../../data-formatter.ts/client-info-formatter";
import { ClientQueryFetcher } from "../../../../database/queries/clientQueries";
import { BotUtils } from "../../clientSignUpService/functions";
import { mainMenuPage } from "../../menus/mainMenuHandler";
import { botMessages } from "../../../messages";
import { ClientEditProfileCallbacks } from "../models";
import { regexPattern, setUpKeyboardIteration } from "../../utils";
import { EditProfileInlineKeyboard } from "./editProfileKeyboard";

export class ProfileCallbackHanler {
  constructor(private ctx: Context) { }
  async handleFetchProfileCallback(bot: Telegraf) {
    const response = await ClientQueryFetcher.getUserProfileById(
      this.ctx.from!.id,
    );
    const data = ClientDataFormatter.formatClientInfo(response);
    await BotUtils.sendBotMessage(this.ctx, data);
    return await mainMenuPage(
      this.ctx,
      bot,
      botMessages.inputRequest.prompts.getMethod.succesfull,
    );
  }
  async handleUpdateProfileCallback(bot: Telegraf) {
    const response = new EditProfileInlineKeyboard(this.ctx);
    return await setUpKeyboardIteration(this.ctx, response, bot, {
      callbackPattern: regexPattern(ClientEditProfileCallbacks),
    });
  }
}
