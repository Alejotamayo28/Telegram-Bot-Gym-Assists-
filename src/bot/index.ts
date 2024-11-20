import { deleteBotMessage, deleteUserMessage, saveUserMessage, userStage, userStageDeleteExercise, userStageGetExercise, userStagePostExercise, userStagePutExercise, userStageSignUp, userState, userStateUpdateName } from "../userState";
import { bot } from "../telegram/bot";
import { handleError } from "../errors";
import { handleSignUpEmail, handleSignUpNickname, handleSignUpPassword } from "../telegram/services/singUp/functions";
import { ExercisePostHandler } from "../telegram/services/addMethod/functions";
import { message } from 'telegraf/filters'
import { NarrowedContext, Context } from "telegraf";
import { Update, Message } from "telegraf/typings/core/types/typegram";
import { handleDeleteExerciseDay, handleDeleteExerciseName, handleDeleteExerciseWeekAndConfirmation } from "../telegram/services/deleteMethod/functions";
import { handleUpdateExerciseDay, handleUpdateExerciseName, handlerUpdateExerciseReps, handlerUpdateExerciseKg, findExerciseByDayName, handleExerciseNotFound } from "../telegram/services/updateMethod/functions";
import { handleLoginNickname, handleLoginPassword } from "../telegram/services/login/functions";
import { deleteLastMessage } from "../telegram/services/utils";
import { fetchExerciseGraphTextController } from "../telegram/services/getMethod";
import { parseInt } from "lodash";
import { PostExerciseVerificationController } from "../telegram/services/addMethod";
import { DataValidator } from "../validators/dataValidator";

export type MyContext =
  | NarrowedContext<Context<Update>, Update.MessageUpdate<Message.TextMessage>>
  | NarrowedContext<Context<Update>, Update.CallbackQueryUpdate>;

bot.on(message("text"), async ctx => {
  const userId = ctx.from!.id;
  const userMessage = ctx.message!.text
  try {
    if (userState[userId]) {
      switch (userState[userId].stage) {

        case userStageSignUp.SIGN_UP_NICKNAME:
          await deleteBotMessage(ctx)
          saveUserMessage(ctx)
          try {
            await handleSignUpNickname(ctx, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break;

        case userStageSignUp.SIGN_UP_PASSWORD:
          await deleteBotMessage(ctx)
          saveUserMessage(ctx)
          try {
            await handleSignUpPassword(ctx, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break;

        case userStageSignUp.SIGN_UP_EMAIL:
          await deleteBotMessage(ctx)
          saveUserMessage(ctx)
          try {
            await handleSignUpEmail(ctx, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break;

        case userStage.LOGIN_NICKNAME:
          await deleteBotMessage(ctx)
          saveUserMessage(ctx)
          try {
            await handleLoginNickname(ctx, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case userStage.LOGIN_PASSWORD:
          await deleteLastMessage(ctx)
          saveUserMessage(ctx)
          try {
            await handleLoginPassword(ctx, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case userStagePostExercise.POST_EXERCISE_DAY:
          await deleteLastMessage(ctx)
          saveUserMessage(ctx)
          try {
            if (await (DataValidator.validateDay(ctx, userMessage))) break
            await ExercisePostHandler.postExerciseDay(ctx, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case userStagePostExercise.POST_EXERCISE_NAME:
          await deleteLastMessage(ctx)
          saveUserMessage(ctx)
          try {
            if (await (DataValidator.validateExercise(ctx, userMessage))) break
            await ExercisePostHandler.postExerciseName(ctx, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case userStagePostExercise.POST_EXERCISE_REPS:
          await deleteLastMessage(ctx)
          saveUserMessage(ctx)
          try {
            if (await (DataValidator.validateReps(ctx, userMessage))) break
            await ExercisePostHandler.postExerciseReps(ctx, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case userStagePostExercise.POST_EXERCISE_VERIFICATION:
          await deleteLastMessage(ctx)
          saveUserMessage(ctx)
          try {
            if (await (DataValidator.validateWeight(ctx, userMessage))) break
            await ExercisePostHandler.postExerciseWeight(ctx, Number(userMessage))
            await PostExerciseVerificationController(ctx, bot)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case userStagePutExercise.PUT_EXERCISE_DAY:
          await deleteLastMessage(ctx)
          saveUserMessage(ctx)
          try {
            if (await (DataValidator.validateDay(ctx, userMessage))) break
            await handleUpdateExerciseDay(ctx, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case userStagePutExercise.PUT_EXERCISE_NAME:
          await deleteLastMessage(ctx)
          saveUserMessage(ctx)
          try {
            if (await (DataValidator.validateExercise(ctx, userMessage))) break
            userStateUpdateName(ctx, userMessage)
            const exercise = await findExerciseByDayName(userId, userState[userId])
            if (!exercise) {
              await saveUserMessage(ctx)
              await handleExerciseNotFound(ctx)
              return
            }
            await handleUpdateExerciseName(ctx, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case userStagePutExercise.PUT_EXERCISE_REPS:
          await deleteLastMessage(ctx)
          saveUserMessage(ctx)
          try {
            if (await (DataValidator.validateReps(ctx, userMessage))) break
            await handlerUpdateExerciseReps(ctx, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case userStagePutExercise.PUT_EXERCISE_WEIGHT:
          await deleteLastMessage(ctx)
          saveUserMessage(ctx)
          try {
            if (await (DataValidator.validateWeight(ctx, userMessage))) break
            await handlerUpdateExerciseKg(ctx, parseInt(userMessage))
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case userStageGetExercise.GET_EXERCISE_OPTIONS:
          await deleteLastMessage(ctx)
          saveUserMessage(ctx)
          try {
            if (await (DataValidator.validateDay(ctx, userMessage))) break
            deleteUserMessage(ctx)
            await fetchExerciseGraphTextController(ctx, bot, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case userStageDeleteExercise.DELETE_EXERCISE_DAY:
          await deleteLastMessage(ctx)
          saveUserMessage(ctx)
          try {
            if (await (DataValidator.validateDay(ctx, userMessage))) break
            await handleDeleteExerciseDay(ctx, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case userStageDeleteExercise.DELETE_EXERCISE_NAME:
          await deleteLastMessage(ctx)
          saveUserMessage(ctx)
          try {
            if (await (DataValidator.validateExercise(ctx, userMessage))) break
            await handleDeleteExerciseName(ctx, userMessage)
          } catch (error) {
            console.error(`Error: `, error)
          }
          break;
        /**
      case userStageDeleteExercise.DELETE_EXERCISE_NAME:
        await deleteLastMessage(ctx)
        saveUserMessage(ctx)
        try {
          userStateUpdateName(ctx, userMessage)
          const exercise = await ExerciseQueryFetcher.ExerciseByNameRepsAndId(userId, userState[userId])
          if (!exercise) {
            await deleteUserMessage(ctx)
            await handleExerciseNotFound(ctx)
            return
          }
          await deleteExerciseVerificationController(ctx, bot)
        } catch (error) {
          await handleError(error, userState[userId].stage, ctx)
        }
        break
        */

        case userStageDeleteExercise.DELETE_EXERCISE_WEEK:
          await deleteLastMessage(ctx)
          saveUserMessage(ctx)
          try {
            if (await (DataValidator.validateWeek(ctx, userMessage))) break
            await handleDeleteExerciseWeekAndConfirmation(ctx, bot, userMessage)
          } catch (error) {
            console.error(`Error: `, error)
          }
          break

        default:
          ctx.reply(`*Ha ocurrdio un error, vuelve a escoger la accion para volver a comenzar.*`, {
            parse_mode: "Markdown",
          });
          break;
      }
    }
  } catch (error) {
    console.error('Error handling user message:', error);
    ctx.reply('Ha ocurrido un error. Por favor, intenta nuevamente más tarde.');
  } finally {
  }
});

export { bot };
