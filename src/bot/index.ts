import { pool } from "../database/database";
import { userState } from "../userState";
import { bot } from "../telegram/bot";
import { handleLoginNickname, handleLoginPassword } from "./functions/login";
import { handleError } from "../errors";
import { handleSignUpEmail, handleSignUpNickname, handleSignUpPassword } from "../telegram/services/singUp/functions";
import { handleAddExerciseDay, handleAddExerciseName, handleAddExerciseReps, handleAddExerciseVerification } from "../telegram/services/addMethod/functions";
import { message } from 'telegraf/filters'
import { NarrowedContext, Context } from "telegraf";
import { Update, Message } from "telegraf/typings/core/types/typegram";
import { handleGetDailyExercises } from "./functions/getExercise/day";
import { handleDeleteExerciseDay, handleDeleteExerciseName } from "../telegram/services/deleteMethod/functions";
import { handleUpdateExerciseDay, handleUpdateExerciseName, handlerUpdateExerciseReps, handlerUpdateExerciseKg } from "../telegram/services/updateMethod/functions";
import { graphic } from "./functions/getExercise/weekly";

// Type for both text messages and callback queries (chatGPT cookHere)
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
          try {
            await handleAddExerciseDay(ctx, userId, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case `menu_post_exercise_name`:
          try {
            await handleAddExerciseName(ctx, userId, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case `menu_post_exercise_reps`:
          try {
            await handleAddExerciseReps(ctx, userId, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case `menu_post_exercise_verification`:
          try {
            await handleAddExerciseVerification(ctx, userId, userMessage)
            delete userState[userId]
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case 'menu_put_exercise_day':
          try {
            await handleUpdateExerciseDay(ctx, userId, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break


        case 'menu_put_exercise_name':
          try {
            await handleUpdateExerciseName(ctx, userId, userMessage, client)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case 'menu_put_exercise_reps':
          try {
            await handlerUpdateExerciseReps(ctx, userId, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break


        case 'menu_put_exercise_weight':
          try {
            await handlerUpdateExerciseKg(ctx, userId, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case 'menu_get_weekly':
          try {
            await handleGetDailyExercises(ctx, userMessage, userId)
            const image = await graphic(userId, userMessage)
            await ctx.replyWithPhoto({ 
              source: image, filename: 'exercise_chart.png' }, {
              caption: 'Gráfico de tus ejercicios'
            });
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break



        case 'menu_delete_exercise_day':
          try {
            await handleDeleteExerciseDay(ctx, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break


        case 'menu_delete_exercise_name':
          try {
            await handleDeleteExerciseName(ctx, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }


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
