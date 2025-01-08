import { deleteBotMessage, deleteUserMessage, saveBotMessage, saveUserMessage, userMessageTest, userStage, userStageCreateFamily, userStageDeleteExercise, userStageGetExercise, userStagePostExercise, userStagePutExercise, userStageSignUp, userState, userStateUpdateFamilyName, userStateUpdateFamilyPassword, userStateUpdateName, userStateUpdatePassword, userStateUpdateStage } from "../userState";
import { bot } from "../telegram/bot";
import { handleError } from "../errors";
import { BotUtils, RegisterHandler, testingDataStructures } from "../telegram/services/singUp/functions";
import { ExercisePostHandler } from "../telegram/services/addMethod/functions";
import { message } from 'telegraf/filters'
import { NarrowedContext, Context } from "telegraf";
import { Update, Message } from "telegraf/typings/core/types/typegram";
import { ExerciseDeleteHandler } from "../telegram/services/deleteMethod/functions";
import { handleUpdateExerciseDay, handleUpdateExerciseName, handlerUpdateExerciseReps, handlerUpdateExerciseKg, findExerciseByDayName, handleExerciseNotFound } from "../telegram/services/updateMethod/functions";
import { LoginHandler } from "../telegram/services/login/functions";
import { deleteLastMessage } from "../telegram/services/utils";
import { fetchExerciseGraphTextController } from "../telegram/services/getMethod";
import { parseInt } from "lodash";
import { PostExerciseVerificationController } from "../telegram/services/addMethod";
import { DataValidator } from "../validators/dataValidator";
import { ExerciseGetHandler, ExerciseGetUtils } from "../telegram/services/getMethod/functions";
import { validateMonths } from "../validators/allowedValues";
import { ExerciseQueryFetcher } from "../telegram/services/getMethod/queries";
import { mainMenuPage, redirectToMainMenuWithTaskDone } from "../telegram/mainMenu";
import { botMessages } from "../telegram/messages";
import { encrypt } from "../middlewares/jsonWebToken/enCryptHelper";
import { onSession, onTransaction } from "../database/dataAccessLayer";
import { familyInlinekeyboardController } from "../telegram/mainMenu/inlineKeyboard";

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
            await RegisterHandler.registerNickname(ctx, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break;

        case userStageSignUp.SIGN_UP_PASSWORD:
          await deleteBotMessage(ctx)
          saveUserMessage(ctx)
          try {
            await RegisterHandler.registerPassword(ctx, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break;

        case userStageSignUp.SIGN_UP_EMAIL:
          await deleteBotMessage(ctx)
          saveUserMessage(ctx)
          try {
            await RegisterHandler.registerEmail(ctx, bot, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break;

        case userStage.LOGIN_NICKNAME:
          await deleteBotMessage(ctx)
          saveUserMessage(ctx)
          try {
            await LoginHandler.loginNickname(ctx, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case userStage.LOGIN_PASSWORD:
          await deleteLastMessage(ctx)
          saveUserMessage(ctx)
          try {
            await LoginHandler.loginPassword(ctx, bot, userMessage)
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
            await testingDataStructures(ctx, userMessage)
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
            return await PostExerciseVerificationController(ctx, bot)
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

        case userStageGetExercise.GET_EXERCISE_MONTH_STAGE:
          await deleteLastMessage(ctx)
          saveUserMessage(ctx)
          try {
            if (await (DataValidator.validateMonth(ctx, userMessage))) break
            await deleteUserMessage(ctx)
            await ExerciseGetHandler.getMonthlyExerciseText(ctx, userMessage, bot)
          } catch (error) {
            console.error(`Error: `, error)
          }
          break;

        case userStageGetExercise.GET_EXERCISE_MONTH:
          await deleteLastMessage(ctx)
          saveUserMessage(ctx)
          try {
            if (await (DataValidator.validateMonth(ctx, userMessage))) break
            await deleteUserMessage(ctx)
            await ExerciseGetHandler.exerciseMonth(ctx, userMessage)
          } catch (error) {
            console.error(`Error: `, error)
          }
          break;

        case userStageGetExercise.GET_EXERCISE_DAY:
          await deleteBotMessage(ctx)
          saveUserMessage(ctx)
          try {
            if (await (DataValidator.validateDay(ctx, userMessage))) break;
            await deleteUserMessage(ctx)
            await ExerciseGetHandler.getDailyExerciseText(ctx, userMessage, bot)
          } catch (error) {
            console.error(`Error: `, error)
          }
          break;

        //working
        case userStageGetExercise.GET_EXERCISE_RECORD:
          await deleteBotMessage(ctx)
          saveUserMessage(ctx)
          try {
            if (await (DataValidator.validateExercise(ctx, userMessage))) break;
            await deleteUserMessage(ctx)
            userStateUpdateName(ctx, userMessage)
            const { month } = userState[ctx.from!.id]
            const monthNumber = validateMonths.indexOf(month) + 1
            const data = await ExerciseQueryFetcher.ExercisesByMonthNameAndId(ctx, monthNumber)
            if (!data.length) return await redirectToMainMenuWithTaskDone(ctx, bot, botMessages.inputRequest.prompts.getMethod.errors.exerciseEmptyData)
            const mappedData = ExerciseGetUtils.mapExercisesByDay(data, "getMethod")
            await BotUtils.sendBotMessage(ctx, mappedData)
            return await redirectToMainMenuWithTaskDone(ctx, bot, botMessages.inputRequest.prompts.getMethod.succesfull)
          } catch (error) {
            console.error(`Error: `, error)
          }
          break;


        case userStageDeleteExercise.DELETE_EXERCISE_MONTH:
          await deleteLastMessage(ctx)
          saveUserMessage(ctx)
          try {
            if (await (DataValidator.validateMonth(ctx, userMessage))) break
            await ExerciseDeleteHandler.exerciseMonth(ctx, userMessage, bot)
          } catch (error) {
            console.error(`Error :`, error)
          }
          break

        case userStageDeleteExercise.DELETE_EXERCISE_DAY:
          await deleteLastMessage(ctx)
          saveUserMessage(ctx)
          console.log(`no deberia entrar aqui`)
          try {
            if (await (DataValidator.validateDay(ctx, userMessage))) break
            await ExerciseDeleteHandler.exerciseDay(ctx, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case userStageDeleteExercise.DELETE_EXERCISE_NAME:
          await deleteLastMessage(ctx)
          saveUserMessage(ctx)
          try {
            /*Mostrar sugerencias de nombres, tenemos el mes, dia, vamos a asumir que es del anio actual
            const { day, month } = userState[ctx.from!.id]
            console.log({ day, month })
            const data = await ExerciseQueryFetcher.ExerciseByIdAndDayAndMonth(ctx.from!.id, day, month)
            await exercisesInlineKeybaord(ctx, bot, data)
            */

            if (await (DataValidator.validateExercise(ctx, userMessage))) break
            await ExerciseDeleteHandler.exerciseName(ctx, userMessage)
          } catch (error) {
            console.error(`Error: `, error)
          }
          break;

        case userStageDeleteExercise.DELETE_EXERCISE_WEEK:
          await deleteLastMessage(ctx)
          saveUserMessage(ctx)
          try {
            if (await (DataValidator.validateWeek(ctx, userMessage))) break
            await ExerciseDeleteHandler.exerciseWeekAndConfirmation(ctx, bot, userMessage)
          } catch (error) {
            console.error(`Error: `, error)
          }
          break

        case userStageCreateFamily.POST_FAMILY_NAME:
          await deleteBotMessage(ctx)
          saveUserMessage(ctx)
          try {
            await deleteUserMessage(ctx)
            userStateUpdateFamilyName(ctx, userMessage)
            const message = await ctx.reply(`Digita la contrasena de tu familia...`)
            saveBotMessage(ctx, message.message_id)
            userStateUpdateStage(ctx, userStageCreateFamily.POST_FAMILY_PASSWORD)
          } catch (error) {
            console.error(`Error: `, error)
          }

          break;

        case userStageCreateFamily.POST_FAMILY_PASSWORD:
          await deleteBotMessage(ctx)
          saveUserMessage(ctx)
          try {
            await deleteUserMessage(ctx)
            const password = userMessage
            const passwordhash = await encrypt(password)
            userStateUpdateFamilyPassword(ctx, passwordhash)
            await onTransaction(async (clientTransaction) => {
              const { familyName, familyPassword } = userState[ctx.from!.id]
              await clientTransaction.query(`INSERT INTO family (name, password, user_1) VALUES ($1 ,$2, $3)`,
                [familyName, familyPassword, ctx.from!.id])
            })
            return await mainMenuPage(ctx, bot, `Familia creada satisfacctoriamente, gracias por haber creado una familia`)
          } catch (error) {
            console.error(`Error: `, error)
          }
          break;


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
