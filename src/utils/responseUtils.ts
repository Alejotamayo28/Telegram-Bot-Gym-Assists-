import { Context, Telegraf } from "telegraf";
import { botMessages } from "../telegram/messages";
import { mainMenuPage } from "../telegram/services/menus/mainMenuHandler/mainMenuController";

export async function dataLenghtEmpty(ctx: Context, bot: Telegraf) {
  return await mainMenuPage(
    ctx,
    bot!,
    botMessages.inputRequest.prompts.getMethod.errors.exerciseEmptyData,
  );
}
