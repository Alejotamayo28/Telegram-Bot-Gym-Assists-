import { pool } from "../database/database";
import { userState } from "../userState";
import { sendMenuFunctions } from "../telegram/menus/userMenu";
import { bot } from "../telegram/bot";
import { handleLoginNickname, handleLoginPassword } from "./functions/login";
import { handleError } from "../errors";
import { handleSignUpEmail, handleSignUpNickname, handleSignUpPassword } from "./functions/singUp";
import { handleAddExerciseDay, handleAddExerciseName, handleAddExerciseReps, handleAddExerciseVerification } from "./functions/addExercise";
import { handleUpdateExerciseDay, handleUpdateExerciseName, handlerUpdateExerciseKg, handlerUpdateExerciseReps } from "./functions/updateExercise";
import { message } from 'telegraf/filters'
import { NarrowedContext, Context } from "telegraf";
import { Update, Message } from "telegraf/typings/core/types/typegram";
import { handleGetDailyExercises } from "./functions/getExercise/day";


// Type for both text messages and callback queries (chatGPT cookHere)
export type MyContext =
  | NarrowedContext<Context<Update>, Update.MessageUpdate<Message.TextMessage>>
  | NarrowedContext<Context<Update>, Update.CallbackQueryUpdate>;


bot.on(message("text"), async ctx => {
  const client = await pool.connect();
  const userId = ctx.from!.id;
  const userMessage = ctx.message.text
  try {
    if (userState[userId]) {
      switch (userState[userId].stage) {
        case 'signUp_nickname':
          try {
            await handleSignUpNickname(ctx, userId, userMessage, client)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break;

        case 'signUp_password':
          try {
            await handleSignUpPassword(ctx, userId, userMessage)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break;

        case 'signUp_email':
          try {
            await handleSignUpEmail(ctx, userId, userMessage, client)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break;


        case 'login_nickname':
          try {
            await handleLoginNickname(ctx, userId, userMessage, client)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break

        case 'login_password':
          try {
            await handleLoginPassword(ctx, userId, userMessage)
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
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break



        case 'menu_delete_exercise_day':
          try {
            userState[userId].day = userMessage.toLowerCase()
            await ctx.reply(`Por favor, digita el nombre del ejercicio a eliminar`)
            userState[userId].stage = 'menu_delete_exercise_name'
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break


        case 'menu_delete_exercise_name':
          try {
            userState[userId].name = userMessage.toLowerCase()
            await client.query(`DELETE FROM workout WHERE name = $1 AND day = $2 AND id = $3`,
              [userState[userId].name, userState[userId].day, userId])
            await ctx.reply(`Ejercicio eliminado con exito!`)
            await sendMenuFunctions(ctx)
          } catch (error) {
            await handleError(error, userState[userId].stage, ctx)
          }
          break;

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
