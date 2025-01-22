import {
  BotStage,
  deleteBotMessage,
  deleteUserMessage,
  saveUserMessage,
  userState,
} from "../userState";
import { bot } from "../telegram/bot";
import { handleError } from "../errors";
import { message } from "telegraf/filters";
import { NarrowedContext, Context } from "telegraf";
import { Update, Message } from "telegraf/typings/core/types/typegram";
import { deleteLastMessage } from "../telegram/services/utils";
import { PostExerciseVerificationController } from "../telegram/services/workoutPostService/exercisePostController";
import { DataValidator } from "../validators/dataValidator";
import { mainMenuPage } from "../telegram/services/menus/mainMenuHandler/mainMenuController";
import { botMessages } from "../telegram/messages";
import { TelegramLoginHandler } from "./stages/login";
import { TelegramSignUpHandler } from "./stages/signUp";
import { TelegramExerciseHandler } from "./stages/exercise";
import { testingDataStructures } from "../utils/trieNode";
import { TelegramFamilyHandler } from "./stages/family";
import {
  handleProfileEdit,
} from "./stages/editProfile";

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

        case BotStage.Exercise.GET_ONE_EXERCISE_RECORD:
          await deleteBotMessage(ctx);
          saveUserMessage(ctx);
          try {
            if (await DataValidator.validateExercise(ctx, userMessage)) break;
            await TelegramExerciseHandler.stage.GET_ONE_EXERCISE_RECORD({
              ctx,
              userMessage,
            });
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

        case BotStage.PostFamily.NAME:
          await deleteBotMessage(ctx);
          saveUserMessage(ctx);
          try {
            return await TelegramFamilyHandler.stageFamiy.NAME({
              ctx,
              userMessage,
            });
          } catch (error) {
            return await handleError(error, BotStage.PostFamily.NAME, ctx);
          }

        case BotStage.PostFamily.PASSWORD:
          await deleteBotMessage(ctx);
          saveUserMessage(ctx);
          try {
            return await TelegramFamilyHandler.stageFamiy.PASSWORD({
              ctx,
              userMessage,
              bot,
            });
          } catch (error) {
            return await handleError(error, BotStage.PostFamily.PASSWORD, ctx);
          }

        case BotStage.PostFamily.JOIN_FAMILY_NAME:
          await deleteBotMessage(ctx);
          saveUserMessage(ctx);
          try {
            return await TelegramFamilyHandler.stageFamiy.JOIN_FAMILY_NAME({
              ctx,
              userMessage,
            });
          } catch (error) {
            return await handleError(
              error,
              BotStage.PostFamily.JOIN_FAMILY_NAME,
              ctx,
            );
          }

        case BotStage.PostFamily.JOIN_FAMILY_PASSWORD:
          await deleteUserMessage(ctx);
          saveUserMessage(ctx);
          try {
            return await TelegramFamilyHandler.stageFamiy.JOIN_FAMILY_PASSWORD({
              ctx,
              userMessage,
              bot,
            });
          } catch (error) {
            return await handleError(
              error,
              BotStage.PostFamily.JOIN_FAMILY_PASSWORD,
              ctx,
            );
          }

        case BotStage.EditProfile.TESTING:
          await deleteUserMessage(ctx);
          saveUserMessage(ctx);
          try {
            return await handleProfileEdit(ctx, bot, userMessage);
          } catch (error) {
            return await handleError(error, BotStage.EditProfile.TESTING, ctx);
          }

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
