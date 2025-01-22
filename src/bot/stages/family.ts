import { onSession, onTransaction } from "../../database/dataAccessLayer";
import { compare, encrypt } from "../../middlewares/jsonWebToken/enCryptHelper";
import { botMessages } from "../../telegram/messages";
import { BotUtils } from "../../utils/botUtils";
import { mainMenuPage } from "../../telegram/services/menus/mainMenuHandler/mainMenuController";
import {
  BotStage,
  deleteUserMessage,
  getUserFamily,
  updateUserState,
} from "../../userState";
import { TelegramContext } from "./login";

export class TelegramFamilyHandler {
  static stageFamiy: {
    [key in keyof typeof BotStage.PostFamily]: (
      stageParams: TelegramContext,
    ) => Promise<void>;
  } = {
      NAME: async function ({ ctx, userMessage }): Promise<void> {
        try {
          await deleteUserMessage(ctx);
          const familyName = userMessage;
          const response = await onSession(async (clientTransaction) => {
            const response = await clientTransaction.query(
              "SELECT family_name FROM family WHERE family_name = $1",
              [familyName],
            );
            return response.rowCount;
          });
          if (response != 0) {
            return await BotUtils.sendBotMessage(
              ctx,
              botMessages.inputRequest.prompts.familyMethod
                .familyNameNotAvailable,
            );
          } else {
            updateUserState(ctx.from!.id, {
              stage: BotStage.PostFamily.PASSWORD,
              data: {
                family: {
                  family_name: familyName,
                },
              },
            });
          }
          await BotUtils.sendBotMessage(
            ctx,
            botMessages.inputRequest.prompts.familyMethod.createFamiyPassword,
          );
        } catch (error) { }
      },
      PASSWORD: async function ({ ctx, userMessage, bot }): Promise<void> {
        await deleteUserMessage(ctx);
        const password = userMessage;
        const passwordhash = await encrypt(password);
        updateUserState(ctx.from!.id, {
          data: {
            family: {
              family_password: passwordhash,
            },
          },
        });
        await onTransaction(async (clientTransaction) => {
          const { family_name, family_password } = getUserFamily(ctx.from!.id);
          await clientTransaction.query(
            `INSERT INTO family 
                  (family_name, family_password) VALUES 
                    ($1 ,$2)`,
            [family_name, family_password],
          );
        });
        return await mainMenuPage(
          ctx,
          bot!,
          botMessages.inputRequest.prompts.familyMethod.familyCreatedSuccesfull,
        );
      },
      JOIN_FAMILY_NAME: async function ({ ctx, userMessage }): Promise<void> {
        const familyName = userMessage;
        const response = await onSession(async (clientTransaction) => {
          const response = await clientTransaction.query(
            `SELECT family_name, family_password, family_id FROM family WHERE family_name = $1`,
            [familyName],
          );
          return response.rows[0];
        });
        const { family_name, family_password, family_id } = response;
        if (!response) {
          await BotUtils.sendBotMessage(
            ctx,
            botMessages.inputRequest.prompts.familyMethod.familyNameNotExist,
          );
          return;
        } else {
          updateUserState(ctx.from!.id, {
            stage: BotStage.PostFamily.JOIN_FAMILY_PASSWORD,
            data: {
              family: {
                family_name: family_name,
                family_password: family_password,
                family_id: family_id,
              },
            },
          });
        }
        return await BotUtils.sendBotMessage(
          ctx,
          botMessages.inputRequest.prompts.familyMethod.familyRequestPassword,
        );
      },
      JOIN_FAMILY_PASSWORD: async function ({
        ctx,
        userMessage,
        bot,
      }): Promise<void> {
        await deleteUserMessage(ctx);
        const intputPassword = userMessage;
        const { family_password, family_id } = getUserFamily(ctx.from!.id);
        const comparePassword = await compare(intputPassword, family_password);
        if (!comparePassword) {
          return await BotUtils.sendBotMessage(ctx, ``);
        } else {
          await onTransaction(async (clientTransaction) => {
            await clientTransaction.query(
              `INSERT INTO family_member (family_id, client_id, role)
                    VALUES ($1, $2, $3)`,
              [family_id, ctx.from!.id, "MEMBER"],
            );
          });
          return await mainMenuPage(
            ctx,
            bot!,
            "🎉 *¡Has ingresado a la familia exitosamente!*\n\n",
          );
        }
      },
    };
}
