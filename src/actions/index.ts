import { bot } from "../bot";
import { sendMainMenu } from "../bot/messages/menu/loginSingUp";


bot.start(async (ctx) => {
    await sendMainMenu(ctx)
});
