import { pool } from "../database/database";
import { userState } from "../userState";
import { bot } from "../telegram/bot";
import { handleError } from "../errors";
import { handleSignUpEmail, handleSignUpNickname, handleSignUpPassword } from "../telegram/services/singUp/functions";
import { handleAddExerciseDay, handleAddExerciseName, handleAddExerciseReps, handleAddExerciseVerification, handleIncorrectDayInput, handleIncorrectExerciseInput, isAllRepsValid, verifyDayInput } from "../telegram/services/addMethod/functions";
import { message } from 'telegraf/filters'
import { NarrowedContext, Context } from "telegraf";
import { Update, Message } from "telegraf/typings/core/types/typegram";
import { handleDeleteExerciseDay, handleDeleteExerciseName } from "../telegram/services/deleteMethod/functions";
import { handleUpdateExerciseDay, handleUpdateExerciseName, handlerUpdateExerciseReps, handlerUpdateExerciseKg, findExerciseByDayName, handleExerciseNotFound } from "../telegram/services/updateMethod/functions";
import { handleLoginNickname, handleLoginPassword } from "../telegram/services/login/functions";
import { inlineKeyboardGetDailyExercicses } from "../telegram/services/getMethod/inlineKeyboard";
import { GET_RESULT_OPTIONS } from "../telegram/services/getMethod/messages";
import { deleteLastMessage, verifyExerciseInput } from "../telegram/services/utils";
import { handleGetDailyExercisesGraphic, handleGetDailyExercisesText } from "../telegram/services/getMethod";
import { isNaN, parseInt } from "lodash";
import { EXERCISE_REPS_INVALID_OUTPUT, EXERCISE_WEIGHT_OUTPUT_INVALID } from "../telegram/services/addMethod/messages";

export type MyContext =
  | NarrowedContext<Context<Update>, Update.MessageUpdate<Message.TextMessage>>
  | NarrowedContext<Context<Update>, Update.CallbackQueryUpdate>;


bot.on(message("text"), async ctx => {
  const client = await pool.connect();
  const userId = ctx.from!.id;
  const userMessage = ctx.message!.text
  try {
    if (userState[userId]) {
      switch (userState[userId].stage) {
        case 'signUp_nickname':
          try {
            await handleSignUpNickname(ctx)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break;

        case 'signUp_password':
          try {
            await handleSignUpPassword(ctx)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break;

        case 'signUp_email':
          try {
            await handleSignUpEmail(ctx)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break;

        case 'login_nickname':
          try {
            await handleLoginNickname(ctx)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case 'login_password':
          try {
            await handleLoginPassword(ctx)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case `menu_post_exercise_day`:
          await deleteLastMessage(ctx)
          try {
            if (!verifyDayInput(userMessage)) {
              await ctx.deleteMessage()
              await handleIncorrectDayInput(ctx)
              break
            }
            await handleAddExerciseDay(ctx, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case `menu_post_exercise_name`:
          await deleteLastMessage(ctx)
          try {
            if (!verifyExerciseInput(userMessage)) {
              await ctx.deleteMessage()
              await handleIncorrectExerciseInput(ctx)
              return
            }
            await handleAddExerciseName(ctx, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case `menu_post_exercise_reps`:
          await deleteLastMessage(ctx)
          try {
            const reps = userMessage.split(" ").map(Number)
            if (!isAllRepsValid(reps)) {
              await ctx.deleteMessage()
              await ctx.reply(EXERCISE_REPS_INVALID_OUTPUT, {
                parse_mode: "Markdown"
              });
              return;
            }
            await handleAddExerciseReps(ctx, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case `menu_post_exercise_verification`:
          await deleteLastMessage(ctx)
          try {
            if (isNaN(parseInt(userMessage))) {
              await ctx.deleteMessage()
              await ctx.reply(EXERCISE_WEIGHT_OUTPUT_INVALID, {
                parse_mode: "Markdown"
              })
              return
            }
            await handleAddExerciseVerification(ctx, parseInt(userMessage))
            delete userState[userId]
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case 'menu_put_exercise_day':
          await deleteLastMessage(ctx)
          try {
            if (!verifyDayInput(userMessage)) {
              await ctx.deleteMessage()
              await handleIncorrectDayInput(ctx)
              return
            }
            await handleUpdateExerciseDay(ctx, userId, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break


        case 'menu_put_exercise_name':
          await deleteLastMessage(ctx)
          try {
            if (!verifyExerciseInput(userMessage)) {
              await ctx.deleteMessage()
              await handleIncorrectExerciseInput(ctx)
              return
            }
            userState[userId] = {
              ...userState[userId],
              name: userMessage
            }
            const exercise = await findExerciseByDayName(userId, userState[userId])
            if (!exercise) {
              await ctx.deleteMessage()
              await handleExerciseNotFound(ctx)
              return
            }
            await handleUpdateExerciseName(ctx, userId)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case 'menu_put_exercise_reps':
          await deleteLastMessage(ctx)
          try {
            const reps = userMessage.split(" ").map(Number)
            if (!isAllRepsValid(reps)) {
              await ctx.deleteMessage()
              await ctx.reply(EXERCISE_REPS_INVALID_OUTPUT, {
                parse_mode: "Markdown"
              });
              return;
            }
            await handlerUpdateExerciseReps(ctx, userId, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case 'menu_put_exercise_weight':
          await deleteLastMessage(ctx)
          try {
            if (isNaN(parseInt(userMessage))) {
              await ctx.deleteMessage()
              await ctx.reply(EXERCISE_WEIGHT_OUTPUT_INVALID, {
                parse_mode: "Markdown"
              })
            }
            await handlerUpdateExerciseKg(ctx, userId, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case 'menuGetExerciseOptions':
          await deleteLastMessage(ctx)
          try {
            if (!verifyDayInput(userMessage)) {
              await ctx.deleteMessage()
              await handleIncorrectDayInput(ctx)
              break
            }
            await ctx.deleteMessage()
            await ctx.reply(GET_RESULT_OPTIONS, {
              parse_mode: "Markdown",
              reply_markup: inlineKeyboardGetDailyExercicses.reply_markup
            })
            bot.action(`grafico`, async (ctx) => {
              await handleGetDailyExercisesGraphic(ctx, userMessage)
            })
            bot.action(`texto`, async (ctx) => {
              await handleGetDailyExercisesText(ctx, userMessage)
            })
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case 'menu_delete_exercise_day':
          await deleteLastMessage(ctx)
          try {
            if (!verifyDayInput(userMessage)) {
              await ctx.deleteMessage();
              await handleIncorrectDayInput(ctx);
              return;
            }
            await handleDeleteExerciseDay(ctx, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case 'menu_delete_exercise_name':
          await deleteLastMessage(ctx)
          try {
            userState[userId] = {
              ...userState[userId],
              name: userMessage
            }
            const exercise = await findExerciseByDayName(userId, userState[userId])
            if (!exercise) {
              await ctx.deleteMessage()
              await handleExerciseNotFound(ctx)
              return
            }
            await handleDeleteExerciseName(ctx)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        default:
          ctx.reply('Por favor, selecciona una opción válida para continuar.');
          break;
      }
    }
  } catch (error) {
    console.error('Error handling user message:', error);
    ctx.reply('Ha ocurrido un error. Por favor, intenta nuevamente más tarde.');
  } finally {
    client.release();
  }
});

export { bot };
