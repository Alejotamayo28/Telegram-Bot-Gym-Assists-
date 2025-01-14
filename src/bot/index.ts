import { FamilyRole, BotStage, deleteBotMessage, deleteUserMessage, getUserExercise, getUserFamily, getUserSelectedExercisesId, getUserUpdateExercise, saveUserMessage, UpdateExercise, updateUserState, userStageCreateFamily, userState } from "../userState";
import { bot } from "../telegram/bot";
import { handleError } from "../errors";
import { BotUtils, RegisterHandler, testingDataStructures } from "../telegram/services/singUp/functions";
import { ExercisePostHandler } from "../telegram/services/addMethod/functions";
import { message } from 'telegraf/filters'
import { NarrowedContext, Context } from "telegraf";
import { Update, Message } from "telegraf/typings/core/types/typegram";
import { LoginHandler } from "../telegram/services/login/functions";
import { deleteLastMessage, FamilyType } from "../telegram/services/utils";
import { PostExerciseVerificationController } from "../telegram/services/addMethod";
import { DataValidator } from "../validators/dataValidator";
import { ExerciseGetUtils } from "../telegram/services/getMethod/functions";
import { validateMonths } from "../validators/allowedValues";
import { ExerciseQueryFetcher } from "../telegram/services/getMethod/queries";
import { mainMenuPage } from "../telegram/mainMenu";
import { botMessages } from "../telegram/messages";
import { encrypt } from "../middlewares/jsonWebToken/enCryptHelper";
import { onSession, onTransaction } from "../database/dataAccessLayer";
import { compare } from "bcryptjs";

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
            //IMPROVED THE OUTPUT OF 'testingDataStructures'
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
                'UPDATE workout SET weight = $1, reps = $2  WHERE user_id = $3 AND id = ANY($4)',
                [weight, reps, userId, exercisesId])
            })
            return await mainMenuPage(ctx, bot,
              `✅ *¡Ejercicio(s) actualizado(s) exitosamente!*\n\n🎉 Los cambios se han guardado correctamente.`);
          } catch (error) {
            console.error('Error: ', error)
          }
          break;

        case BotStage.Exercise.GET_ONE_EXERCISE_RECORD:
          await deleteBotMessage(ctx)
          saveUserMessage(ctx)
          try {
            if (await (DataValidator.validateExercise(ctx, userMessage))) break;
            await deleteUserMessage(ctx)
            updateUserState(userId, {
              data: {
                exercise: {
                  name: userMessage
                }
              }
            })
            const { month } = getUserExercise(ctx.from!.id)
            const monthNumber = validateMonths.indexOf(month) + 1
            const data = await ExerciseQueryFetcher.ExercisesByMonthNameAndId(ctx, monthNumber)
            if (!data.length) {
              return await mainMenuPage(ctx, bot,
                botMessages.inputRequest.prompts.getMethod.errors.exerciseEmptyData)
            }
            const mappedData = ExerciseGetUtils.mapExercisesByDay(data, "getMethod")
            await BotUtils.sendBotMessage(ctx, mappedData)
            return await mainMenuPage(ctx, bot,
              botMessages.inputRequest.prompts.getMethod.succesfull)
          } catch (error) {
            console.error(`Error: `, error)
          }
          break;

        case BotStage.PostFamily.NAME:
          await deleteBotMessage(ctx)
          saveUserMessage(ctx)
          try {
            await deleteUserMessage(ctx)
            const familyName = userMessage
            const response = await onSession(async (clientTransaction) => {
              const response = await clientTransaction.query(
                'SELECT family_name FROM family WHERE family_name = $1',
                [familyName])
              return response.rowCount
            })
            if (response != 0) {
              return await BotUtils.sendBotMessage(ctx,
                `⚠️ El nombre de familia "${familyName}" ya está en uso.\n\nPor favor, elige otro nombre:`)
            } else {
              updateUserState(userId, {
                stage: BotStage.PostFamily.PASSWORD,
                data: {
                  family: {
                    family_name: familyName
                  }
                }
              })
            }
            await BotUtils.sendBotMessage(ctx,
              `🔒 Por favor, ingresa la contraseña de tu familia para continuar: 

_Ejemplo:_
\`\`\`
familiaPassword
\`\`\``)
          } catch (error) {
            console.error('Error: ', error)
          }
          break;

        case BotStage.PostFamily.PASSWORD:
          await deleteBotMessage(ctx)
          saveUserMessage(ctx)
          try {
            await deleteUserMessage(ctx)
            const password = userMessage
            const passwordhash = await encrypt(password)
            updateUserState(userId, {
              data: {
                family: {
                  family_password: passwordhash
                }
              }
            })
            await onTransaction(async (clientTransaction) => {
              const { family_name, family_password } = getUserFamily(ctx.from!.id)
              await clientTransaction.query(
                `INSERT INTO family 
                  (family_name, family_password) VALUES 
                    ($1 ,$2)`,
                [family_name, family_password])
            })
            return await mainMenuPage(ctx, bot,
              `Familia creada satisfacctoriamente, gracias por haber creado una familia!`)
          } catch (error) {
            console.error(`Error: `, error)
          }
          break;


        case BotStage.PostFamily.JOIN_FAMILY_NAME:
          await deleteBotMessage(ctx)
          saveUserMessage(ctx)
          try {
            await deleteUserMessage(ctx)
            const familyName = userMessage
            const response = await onSession(async (clientTransaction) => {
              const response = await clientTransaction.query(
                `SELECT family_name, family_password, family_id FROM family WHERE family_name = $1`, [familyName])
              return response.rows[0]
            })
            const { family_name, family_password, family_id } = response
            if (!response) {
              await BotUtils.sendBotMessage(ctx,
                `⚠️ El nombre de familia: "${familyName}" no existe.
Por favor, escribe el nombre bien.

_Ejemplo:_
\`\`\`
familiaNombre
\`\`\``)
              return
            } else {
              updateUserState(userId, {
                stage: BotStage.PostFamily.JOIN_FAMILY_PASSWORD,
                data: {
                  family: {
                    family_name: family_name,
                    family_password: family_password,
                    family_id: family_id
                  }
                }
              })
            }
            await BotUtils.sendBotMessage(ctx,
              `🔒 Por favor, ingresa la contraseña de la familia para continuar: 

_Ejemplo:_
\`\`\`
familiaPassword
\`\`\``)
          } catch (error) {
            console.error('Error: ', error)
          }
          break


        case BotStage.PostFamily.JOIN_FAMILY_PASSWORD:
          await deleteUserMessage(ctx)
          saveUserMessage(ctx)
          try {
            await deleteUserMessage(ctx)
            const intputPassword = userMessage
            const { family_password, family_id } = getUserFamily(userId)
            const comparePassword = await compare(intputPassword, family_password)
            if (!comparePassword) {
              return await BotUtils.sendBotMessage(ctx,
                `🔒 Contraseña incorrecta, ingresa la contraseña de la familia para continuar: 

_Ejemplo:_
\`\`\`
familiaPassword
\`\`\``)
            } else {
              await onTransaction(async (clientTransaction) => {
                await clientTransaction.query(
                  `INSERT INTO family_member (family_id, client_id, role)
                    VALUES ($1, $2, $3)`,
                  [family_id, userId, "MEMBER"])
              })
              return await mainMenuPage(ctx, bot, '🎉 *¡Has ingresado a la familia exitosamente!*\n\n')
            }
          } catch (error) {
            console.error('Error: ', error)
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
