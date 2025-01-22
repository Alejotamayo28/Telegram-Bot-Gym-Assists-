import { Context, Telegraf } from "telegraf";
import {
  BotStage,
  deleteUserMessage,
  getUserCredentials,
  updateUserState,
} from "../../userState";
import { BotUtils } from "../../utils/botUtils";
import { botMessages } from "../../telegram/messages";
import { compare } from "bcryptjs";
import { mainMenuPage } from "../../telegram/services/menus/mainMenuHandler/mainMenuController";
import { ClientQueryFetcher } from "../../database/queries/clientQueries";

export interface TelegramContext {
  ctx: Context;
  userMessage: string;
  bot?: Telegraf;
}

export class TelegramLoginHandler {
  static stageRegister: {
    [key in keyof typeof BotStage.Auth]: (
      stageParams: TelegramContext,
    ) => Promise<void>;
  } = {
      NICKNAME: async function ({ ctx, userMessage }): Promise<void> {
        try {
          await deleteUserMessage(ctx);
          const userResponse =
            await ClientQueryFetcher.getClientCredentialsByNickname(userMessage);
          if (!userResponse) {
            await BotUtils.sendBotMessage(
              ctx,
              botMessages.inputRequest.auth.errors.invalidNickname,
            );
            return;
          }
          await BotUtils.sendBotMessage(
            ctx,
            botMessages.inputRequest.auth.password,
          );
          updateUserState(ctx.from!.id, {
            stage: BotStage.Auth.PASSWORD,
            data: {
              credentials: {
                nickname: userResponse.nickname,
                password: userResponse.password,
              },
            },
          });
        } catch (error) {
          console.error("Error: ", error);
        }
      },
      PASSWORD: async function ({ ctx, userMessage, bot }): Promise<void> {
        try {
          await deleteUserMessage(ctx);
          const { password } = getUserCredentials(ctx.from!.id);
          const isPasswordValid = await compare(userMessage, password);
          if (!isPasswordValid) {
            await BotUtils.sendBotMessage(
              ctx,
              botMessages.inputRequest.auth.errors.invalidPassword,
            );
            return;
          }
          return await mainMenuPage(ctx, bot!);
        } catch (error) {
          console.error("Error: ", error);
        }
      },
    };
}
