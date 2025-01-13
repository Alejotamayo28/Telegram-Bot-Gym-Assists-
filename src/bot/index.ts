import { BotStage, deleteBotMessage, deleteUserMessage, getUserSelectedExercisesId, getUserState, getUserUpdateExercise, saveUserMessage, UpdateExercise, updateUserState, userStageCreateFamily, userStageGetExercise, userStagePutExercise, userState, userStateUpdateFamilyPassword, userStateUpdateName } from "../userState";
import { bot } from "../telegram/bot";
import { handleError } from "../errors";
import { BotUtils, RegisterHandler, testingDataStructures } from "../telegram/services/singUp/functions";
import { ExercisePostHandler } from "../telegram/services/addMethod/functions";
import { message } from 'telegraf/filters'
import { NarrowedContext, Context } from "telegraf";
import { Update, Message } from "telegraf/typings/core/types/typegram";
import { handleUpdateExerciseDay, handleUpdateExerciseName, handlerUpdateExerciseReps, findExerciseByDayName, handleExerciseNotFound } from "../telegram/services/updateMethod/functions";
import { LoginHandler } from "../telegram/services/login/functions";
import { deleteLastMessage } from "../telegram/services/utils";
import { PostExerciseVerificationController } from "../telegram/services/addMethod";
import { DataValidator } from "../validators/dataValidator";
import { ExerciseGetUtils } from "../telegram/services/getMethod/functions";
import { validateMonths } from "../validators/allowedValues";
import { ExerciseQueryFetcher } from "../telegram/services/getMethod/queries";
import { mainMenuPage, redirectToMainMenuWithTaskDone } from "../telegram/mainMenu";
import { botMessages } from "../telegram/messages";
import { encrypt } from "../middlewares/jsonWebToken/enCryptHelper";
import { onTransaction } from "../database/dataAccessLayer";

export type MyContext =
  | NarrowedContext<Context<Update>, Update.MessageUpdate<Message.TextMessage>>
  | NarrowedContext<Context<Update>, Update.CallbackQueryUpdate>;

bot.on(message("text"), async ctx => {
  const userId = ctx.from!.id;
  const userMessage = ctx.message!.text
  try {
    if (userState[userId]) {
      switch (userState[userId].stage) {

        case BotStage.Auth.NICKNAME:
          await deleteBotMessage(ctx)
          saveUserMessage(ctx)
          try {
            LoginHandler.loginNickname(ctx, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break;

        case BotStage.Auth.PASSWORD:
          await deleteBotMessage(ctx)
          saveUserMessage(ctx)
          try {
            LoginHandler.loginPassword(ctx, bot, userMessage)
          } catch (error) {
            console.error('Error: ', error)
          }
          break;


        case BotStage.Register.NICKNAME:
          await deleteBotMessage(ctx)
          saveUserMessage(ctx)
          try {
            await RegisterHandler.registerNickname(ctx, userMessage)
          } catch (error) {
            console.error('Error: ', error)
          }
          break;

        case BotStage.Register.PASSWORD:
          await deleteBotMessage(ctx)
          saveUserMessage(ctx)
          try {
            await RegisterHandler.registerPassword(ctx, userMessage)
          } catch (error) {
            console.error('Error: ', error)
          }
          break;

        case BotStage.Register.EMAIL:
          await deleteBotMessage(ctx)
          saveUserMessage(ctx)
          try {
            await RegisterHandler.registerEmail(ctx, bot, userMessage)
          } catch (error) {
            console.error('Error: ', error)
          }
          break;

        case BotStage.Exercise.CREATE_NAME:
          await deleteLastMessage(ctx)
          saveUserMessage(ctx)
          try {
            await testingDataStructures(ctx, userMessage)
            if (await (DataValidator.validateExercise(ctx, userMessage))) break
            await ExercisePostHandler.postExerciseName(ctx, userMessage)
          } catch (error) {
            console.error('Error: ', error)
          }
          break

        case BotStage.Exercise.CREATE_REPS:
          await deleteLastMessage(ctx)
          saveUserMessage(ctx)
          try {
            if (await (DataValidator.validateReps(ctx, userMessage))) break

            await ExercisePostHandler.postExerciseReps(ctx, userMessage)
          } catch (error) {
            console.error('Error: ', error)
          }
          break

        case BotStage.Exercise.CREATE_WEIGHT:
          await deleteLastMessage(ctx)
          saveUserMessage(ctx)
          try {
            if (await (DataValidator.validateWeight(ctx, userMessage))) break
            await ExercisePostHandler.postExerciseWeight(ctx, Number(userMessage))
            return await PostExerciseVerificationController(ctx, bot)
          } catch (error) {
            console.error('Error: ', error)
          }
          break


        case BotStage.Exercise.UPDATE_REPS:
          await deleteLastMessage(ctx)
          saveUserMessage(ctx)
          try {
            await deleteUserMessage(ctx)
            if (await (DataValidator.validateReps(ctx, userMessage))) break
            const reps = userMessage.split(" ").map(Number)
            updateUserState(userId, {
              stage: BotStage.Exercise.UPDATE_WEIGHT,
              data: {
                updateExercise: {
                  reps: reps
                }
              }
            })
            await BotUtils.sendBotMessage(
              ctx,
              `🏋️‍♂️ *Actualización de peso*\n\n` +
              `Por favor, digita el nuevo peso que deseas registrar para este ejercicio. Ejemplo:\n` +
              `\`\`\`\n85\n\`\`\`\n` +
              `✅ Asegúrate de incluir solo el números.`
            );
          } catch (error) {
            console.error('Error ', error)
          }
          break


        case BotStage.Exercise.UPDATE_WEIGHT:
          await deleteLastMessage(ctx)
          saveUserMessage(ctx)
          try {
            await deleteUserMessage(ctx)
            if (await (DataValidator.validateWeight(ctx, userMessage))) break
            const weightNumber = Number(userMessage)
            updateUserState(userId, {
              data: {
                updateExercise: {
                  weight: weightNumber
                }
              }
            })
            const { reps, weight }: UpdateExercise = getUserUpdateExercise(userId)
            console.log({ reps, weight })
            const { exercisesId } = getUserSelectedExercisesId(userId)
            await onTransaction(async (clientTransaction) => {
              await clientTransaction.query(
                'UPDATE workout SET kg = $1, reps = $2  WHERE user_id = $3 AND id = ANY($4)',
                [weight, reps, userId, exercisesId])
            })
            return await mainMenuPage(ctx, bot,
              `✅ *¡Ejercicio(s) actualizado(s) exitosamente!*\n\n🎉 Los cambios se han guardado correctamente.`);
          } catch (error) {
            console.error('Error: ', error)
          }
          break;



        case userStagePutExercise.PUT_EXERCISE_REPS:
          console.log(userStagePutExercise.PUT_EXERCISE_REPS)
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
          console.log(userStagePutExercise.PUT_EXERCISE_WEIGHT)
          await deleteLastMessage(ctx)
          saveUserMessage(ctx)
          try {
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break


        case userStageGetExercise.GET_EXERCISE_RECORD:
          //check
          await deleteBotMessage(ctx)
          saveUserMessage(ctx)
          try {
            if (await (DataValidator.validateExercise(ctx, userMessage))) break;
            await deleteUserMessage(ctx)
            userStateUpdateName(ctx, userMessage)
            const { month } = userState[ctx.from!.id]
            const monthNumber = validateMonths.indexOf(month) + 1
            const data = await ExerciseQueryFetcher.ExercisesByMonthNameAndId(ctx, monthNumber)
            if (!data.length) {
              return await redirectToMainMenuWithTaskDone(ctx, bot,
                botMessages.inputRequest.prompts.getMethod.errors.exerciseEmptyData)
            }
            const mappedData = ExerciseGetUtils.mapExercisesByDay(data, "getMethod")
            await BotUtils.sendBotMessage(ctx, mappedData)
            return await redirectToMainMenuWithTaskDone(ctx, bot,
              botMessages.inputRequest.prompts.getMethod.succesfull)
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
              await clientTransaction.query(
                `INSERT INTO family (name, password, user_1) VALUES ($1 ,$2, $3)`,
                [familyName, familyPassword, ctx.from!.id])
            })
            return await mainMenuPage(ctx, bot,
              `Familia creada satisfacctoriamente, gracias por haber creado una familia`)
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
