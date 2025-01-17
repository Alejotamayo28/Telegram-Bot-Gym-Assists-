import { ClientQueryFetcher } from "../../database/queries/clientQueries";
import { encrypt } from "../../middlewares/jsonWebToken/enCryptHelper";
import { botMessages } from "../../telegram/messages";
import { signUpVerificationController } from "../../telegram/services/clientSignUpService";
import { BotUtils } from "../../telegram/services/clientSignUpService/functions";
import {
  BotStage,
  deleteUserMessage,
  getUserCredentials,
  updateUserState,
} from "../../userState";
import { TelegramContext } from "./login";

export class TelegramSignUpHandler {
  static stageRegister: {
    [key in keyof typeof BotStage.Register]: (
      stageParams: TelegramContext,
    ) => Promise<void>;
  } = {
      NICKNAME: async function ({ ctx, userMessage }): Promise<void> {
        await deleteUserMessage(ctx);
        const userResponse =
          await ClientQueryFetcher.getClientCredentialsByNickname(
            userMessage.toLowerCase(),
          );
        if (userResponse) {
          await BotUtils.sendBotMessage(
            ctx,
            botMessages.inputRequest.auth.errors.invalidNickname,
          );
          return;
        }
        await BotUtils.sendBotMessage(
          ctx,
          botMessages.inputRequest.register.password,
        );
        return updateUserState(ctx.from!.id, {
          stage: BotStage.Register.PASSWORD,
          data: {
            credentials: {
              nickname: userMessage,
            },
          },
        });
      },
      PASSWORD: async function ({ ctx, userMessage }): Promise<void> {
        await deleteUserMessage(ctx);
        await BotUtils.sendBotMessage(
          ctx,
          botMessages.inputRequest.register.email,
        );
        return updateUserState(ctx.from!.id, {
          stage: BotStage.Register.EMAIL,
          data: {
            credentials: {
              password: userMessage,
            },
          },
        });
      },
      EMAIL: async function ({ ctx, userMessage, bot }): Promise<void> {
        await deleteUserMessage(ctx);
        updateUserState(ctx.from!.id, {
          data: {
            credentials: {
              email: userMessage,
            },
          },
        });
        const { password } = getUserCredentials(ctx.from!.id);
        const passwordHash = await encrypt(password);
        return await signUpVerificationController(ctx, bot!, passwordHash);
      },
    };
}
