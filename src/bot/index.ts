import {
  BotStage,
  deleteBotMessage,
  deleteUserMessage,
  getUserFamily,
  saveUserMessage,
  updateUserState,
  userState,
} from "../userState";
import { bot } from "../telegram/bot";
import { handleError } from "../errors";
import {
  BotUtils,
  testingDataStructures,
} from "../telegram/services/clientSignUpService/functions";
import { message } from "telegraf/filters";
import { NarrowedContext, Context } from "telegraf";
import { Update, Message } from "telegraf/typings/core/types/typegram";
import { deleteLastMessage } from "../telegram/services/utils";
import { PostExerciseVerificationController } from "../telegram/services/workoutPostService";
import { DataValidator } from "../validators/dataValidator";
import { mainMenuPage } from "../telegram/services/menus/mainMenuHandler";
import { botMessages } from "../telegram/messages";
import { encrypt } from "../middlewares/jsonWebToken/enCryptHelper";
import { onSession, onTransaction } from "../database/dataAccessLayer";
import { compare } from "bcryptjs";
import { TelegramLoginHandler } from "./stages/login";
import { TelegramSignUpHandler } from "./stages/signUp";
import { TelegramExerciseHandler } from "./stages/exercise";

export type MyContext =
  | NarrowedContext<Context<Update>, Update.MessageUpdate<Message.TextMessage>>
  | NarrowedContext<Context<Update>, Update.CallbackQueryUpdate>;

bot.on(message("text"), async (ctx) => {
  const userId = ctx.from!.id;
  const userMessage = ctx.message!.text;
  try {
    if (userState[userId]) {
      switch (userState[userId].stage) {
        case BotStage.Auth.NICKNAME:
          await deleteBotMessage(ctx);
          saveUserMessage(ctx);
          try {
            TelegramLoginHandler.stageRegister.NICKNAME({
              ctx,
              userMessage,
            });
          } catch (error) {
            return await handleError(error, BotStage.Auth.NICKNAME, ctx);
          }
          break;

        case BotStage.Auth.PASSWORD:
          await deleteBotMessage(ctx);
          saveUserMessage(ctx);
          try {
            await TelegramLoginHandler.stageRegister.PASSWORD({
              ctx,
              userMessage,
              bot,
            });
          } catch (error) {
            return await handleError(error, BotStage.Auth.PASSWORD, ctx);
          }
          break;

        case BotStage.Register.NICKNAME:
          await deleteBotMessage(ctx);
          saveUserMessage(ctx);
          try {
            await TelegramSignUpHandler.stageRegister.NICKNAME({
              ctx,
              userMessage,
            });
          } catch (error) {
            return await handleError(error, BotStage.Register.NICKNAME, ctx);
          }
          break;

        case BotStage.Register.PASSWORD:
          await deleteBotMessage(ctx);
          saveUserMessage(ctx);
          try {
            await TelegramSignUpHandler.stageRegister.PASSWORD({
              ctx,
              userMessage,
            });
          } catch (error) {
            return await handleError(error, BotStage.Register.PASSWORD, ctx);
          }
          break;

        case BotStage.Register.EMAIL:
          await deleteBotMessage(ctx);
          saveUserMessage(ctx);
          try {
            await TelegramSignUpHandler.stageRegister.EMAIL({
              ctx,
              userMessage,
              bot,
            });
          } catch (error) {
            return await handleError(error, BotStage.Register.EMAIL, ctx);
          }
          break;

        case BotStage.Exercise.CREATE_NAME:
          await deleteLastMessage(ctx);
          saveUserMessage(ctx);
          try {
            //IMPROVED THE OUTPUT OF 'testingDataStructures'
            await testingDataStructures(ctx, userMessage);
            if (await DataValidator.validateExercise(ctx, userMessage)) break;
            await TelegramExerciseHandler.stage.CREATE_NAME({
              ctx,
              userMessage,
            });
          } catch (error) {
            return await handleError(error, BotStage.Exercise.CREATE_NAME, ctx);
          }
          break;

        case BotStage.Exercise.CREATE_REPS:
          await deleteLastMessage(ctx);
          saveUserMessage(ctx);
          try {
            if (await DataValidator.validateReps(ctx, userMessage)) break;
            await TelegramExerciseHandler.stage.CREATE_REPS({
              ctx,
              userMessage,
            });
          } catch (error) {
            return await handleError(error, BotStage.Exercise.CREATE_REPS, ctx);
          }
          break;

        case BotStage.Exercise.CREATE_WEIGHT:
          await deleteLastMessage(ctx);
          saveUserMessage(ctx);
          try {
            if (await DataValidator.validateWeight(ctx, userMessage)) break;
            await TelegramExerciseHandler.stage.CREATE_WEIGHT({
              ctx,
              userMessage,
            });
            return await PostExerciseVerificationController(ctx, bot);
          } catch (error) {
            return await handleError(
              error,
              BotStage.Exercise.CREATE_WEIGHT,
              ctx,
            );
          }
          break;

        case BotStage.Exercise.UPDATE_REPS:
          await deleteLastMessage(ctx);
          saveUserMessage(ctx);
          try {
            if (await DataValidator.validateReps(ctx, userMessage)) break;
            await TelegramExerciseHandler.stage.UPDATE_REPS({
              ctx,
              userMessage,
            });
          } catch (error) {
            return await handleError(error, BotStage.Exercise.UPDATE_REPS, ctx);
          }
          break;

        case BotStage.Exercise.UPDATE_WEIGHT:
          await deleteLastMessage(ctx);
          saveUserMessage(ctx);
          try {
            if (await DataValidator.validateWeight(ctx, userMessage)) break;
            await TelegramExerciseHandler.stage.UPDATE_WEIGHT({
              ctx,
              userMessage,
            });
            return await mainMenuPage(
              ctx,
              bot,
              `✅ *¡Ejercicio(s) actualizado(s) exitosamente!*\n\n🎉 Los cambios se han guardado correctamente.`,
            );
          } catch (error) {
            return await handleError(
              error,
              BotStage.Exercise.UPDATE_WEIGHT,
              ctx,
            );
          }
          break;

        case BotStage.Exercise.GET_ONE_EXERCISE_RECORD:
          await deleteBotMessage(ctx);
          saveUserMessage(ctx);
          try {
            if (await DataValidator.validateExercise(ctx, userMessage)) break;
            return await mainMenuPage(
              ctx,
              bot!,
              botMessages.inputRequest.prompts.getMethod.succesfull,
            );
          } catch (error) {
            return await handleError(
              error,
              BotStage.Exercise.GET_ONE_EXERCISE_RECORD,
              ctx,
            );
          }
          break;

        case BotStage.PostFamily.NAME:
          await deleteBotMessage(ctx);
          saveUserMessage(ctx);
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
                `⚠️ El nombre de familia "${familyName}" ya está en uso.\n\nPor favor, elige otro nombre:`,
              );
            } else {
              updateUserState(userId, {
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
              `🔒 Por favor, ingresa la contraseña de tu familia para continuar: 

_Ejemplo:_
\`\`\`
familiaPassword
\`\`\``,
            );
          } catch (error) {
            return await handleError(error, BotStage.PostFamily.NAME, ctx);
          }
          break;

        case BotStage.PostFamily.PASSWORD:
          await deleteBotMessage(ctx);
          saveUserMessage(ctx);
          try {
            await deleteUserMessage(ctx);
            const password = userMessage;
            const passwordhash = await encrypt(password);
            updateUserState(userId, {
              data: {
                family: {
                  family_password: passwordhash,
                },
              },
            });
            await onTransaction(async (clientTransaction) => {
              const { family_name, family_password } = getUserFamily(
                ctx.from!.id,
              );
              await clientTransaction.query(
                `INSERT INTO family 
                  (family_name, family_password) VALUES 
                    ($1 ,$2)`,
                [family_name, family_password],
              );
            });
            return await mainMenuPage(
              ctx,
              bot,
              `Familia creada satisfacctoriamente, gracias por haber creado una familia!`,
            );
          } catch (error) {
            return await handleError(error, BotStage.PostFamily.PASSWORD, ctx);
          }
          break;

        case BotStage.PostFamily.JOIN_FAMILY_NAME:
          await deleteBotMessage(ctx);
          saveUserMessage(ctx);
          try {
            await deleteUserMessage(ctx);
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
                `⚠️ El nombre de familia: "${familyName}" no existe.
Por favor, escribe el nombre bien.

_Ejemplo:_
\`\`\`
familiaNombre
\`\`\``,
              );
              return;
            } else {
              updateUserState(userId, {
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
            await BotUtils.sendBotMessage(
              ctx,
              `🔒 Por favor, ingresa la contraseña de la familia para continuar: 

_Ejemplo:_
\`\`\`
familiaPassword
\`\`\``,
            );
          } catch (error) {
            return await handleError(
              error,
              BotStage.PostFamily.JOIN_FAMILY_NAME,
              ctx,
            );
          }
          break;

        case BotStage.PostFamily.JOIN_FAMILY_PASSWORD:
          await deleteUserMessage(ctx);
          saveUserMessage(ctx);
          try {
            await deleteUserMessage(ctx);
            const intputPassword = userMessage;
            const { family_password, family_id } = getUserFamily(userId);
            const comparePassword = await compare(
              intputPassword,
              family_password,
            );
            if (!comparePassword) {
              return await BotUtils.sendBotMessage(
                ctx,
                `🔒 Contraseña incorrecta, ingresa la contraseña de la familia para continuar: 

_Ejemplo:_
\`\`\`
familiaPassword
\`\`\``,
              );
            } else {
              await onTransaction(async (clientTransaction) => {
                await clientTransaction.query(
                  `INSERT INTO family_member (family_id, client_id, role)
                    VALUES ($1, $2, $3)`,
                  [family_id, userId, "MEMBER"],
                );
              });
              return await mainMenuPage(
                ctx,
                bot,
                "🎉 *¡Has ingresado a la familia exitosamente!*\n\n",
              );
            }
          } catch (error) {
            return await handleError(
              error,
              BotStage.PostFamily.JOIN_FAMILY_PASSWORD,
              ctx,
            );
          }
          break;

        default:
          ctx.reply(
            `*Ha ocurrdio un error, vuelve a escoger la accion para volver a comenzar.*`,
            {
              parse_mode: "Markdown",
            },
          );
          break;
      }
    }
  } catch (error) {
    console.error("Error handling user message:", error);
    ctx.reply("Ha ocurrido un error. Por favor, intenta nuevamente más tarde.");
  } finally {
  }
});

export { bot };
