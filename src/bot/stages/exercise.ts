import { Context } from "telegraf";
import { botMessages } from "../../telegram/messages";
import { BotUtils } from "../../utils/botUtils";
import {
  BotStage,
  deleteUserMessage,
  getUserExercise,
  getUserSelectedExercisesId,
  getUserUpdateExercise,
  updateUserState,
} from "../../userState";
import { TelegramContext } from "./login";
import { onTransaction } from "../../database/dataAccessLayer";
import { validateMonths } from "../../validators/allowedValues";
import { WorkoutQueryFetcher } from "../../database/queries/exerciseQueries";
import { ExerciseFetchFormatter } from "../../data-formatter.ts/exercise-fetch-formatter";
import { dataLenghtEmpty } from "../../utils/responseUtils";

interface MessageResult {
  success: boolean;
  error?: Error | unknown;
  message?: string;
}

export async function handleMessageAndResponse(
  ctx: Context,
  botMessage: string,
  options?: {
    errorMessage: "Error en la eliminacion de mensajes";
    unexpectedErrorMessage: "Error inesperado en la operacion";
  },
): Promise<MessageResult> {
  const defaultOptions = {
    errorMessage: "Error en el envío de mensajes",
    unexpectedErrorMessage: "Error inesperado en la operación",
    ...options,
  };
  try {
    const [message] = await Promise.allSettled([
      deleteUserMessage(ctx),
      BotUtils.sendBotMessage(ctx, botMessage),
    ]);
    if (message.status == "rejected") {
      const error = message.reason;
      console.error(defaultOptions.errorMessage, error);
      return {
        success: false,
        error,
        message: defaultOptions.errorMessage,
      };
    }
    return {
      success: true,
    };
  } catch (error) {
    console.error(defaultOptions.unexpectedErrorMessage, error);
    return {
      success: false,
      error,
      message: defaultOptions.unexpectedErrorMessage,
    };
  }
}

export class TelegramExerciseHandler {

  static stage: {
    [key in keyof typeof BotStage.Exercise]: (
      stageParams: TelegramContext,
    ) => Promise<void>;
  } = {
      CREATE_NAME: async function ({ ctx, userMessage }): Promise<void> {
        const result = await handleMessageAndResponse(
          ctx,
          botMessages.inputRequest.prompts.postMethod.exerciseReps,
        );
        if (!result.success) {
          console.error(result.message);
        }
        return updateUserState(ctx.from!.id, {
          stage: BotStage.Exercise.CREATE_REPS,
          data: {
            exercise: {
              name: userMessage,
            },
          },
        });
      },
      CREATE_REPS: async function ({ ctx, userMessage }): Promise<void> {
        await Promise.allSettled([
          deleteUserMessage(ctx),
          BotUtils.sendBotMessage(
            ctx,
            botMessages.inputRequest.prompts.postMethod.exerciseWeight,
          ),
        ]);
        return updateUserState(ctx.from!.id, {
          stage: BotStage.Exercise.CREATE_WEIGHT,
          data: {
            exercise: {
              reps: userMessage.split(" ").map(Number),
            },
          },
        });
      },
      CREATE_WEIGHT: async function ({ ctx, userMessage }): Promise<void> {
        await deleteUserMessage(ctx);
        return updateUserState(ctx.from!.id, {
          data: {
            exercise: {
              weight: Number(userMessage),
            },
          },
        });
      },
      UPDATE_REPS: async function ({ ctx, userMessage }): Promise<void> {
        await deleteUserMessage(ctx);
        await BotUtils.sendBotMessage(
          ctx,
          `🏋️‍♂️ *Actualización de peso*\n\n` +
          `Por favor, digita el nuevo peso que deseas registrar para este ejercicio. Ejemplo:\n` +
          `\`\`\`\n85\n\`\`\`\n` +
          `✅ Asegúrate de incluir solo el números.`,
        );
        updateUserState(ctx.from!.id, {
          stage: BotStage.Exercise.UPDATE_WEIGHT,
          data: {
            updateExercise: {
              reps: userMessage.split(" ").map(Number),
            },
          },
        });
      },
      UPDATE_WEIGHT: async function ({ ctx, userMessage }): Promise<void> {
        updateUserState(ctx.from!.id, {
          data: {
            updateExercise: {
              weight: Number(userMessage),
            },
          },
        });
        const { reps, weight } = getUserUpdateExercise(ctx.from!.id);
        const { exercisesId } = getUserSelectedExercisesId(ctx.from!.id);
        return await onTransaction(async (clientTransaction) => {
          await clientTransaction.query(
            "UPDATE workout SET weight = $1, reps = $2  WHERE user_id = $3 AND id = ANY($4)",
            [weight, reps, ctx.from!.id, exercisesId],
          );
        });
      },
      GET_NAME: async function (): Promise<void> { },
      GET_ONE_EXERCISE_RECORD: async function ({
        ctx,
        userMessage,
        bot,
      }): Promise<void> {
        await deleteUserMessage(ctx);
        updateUserState(ctx.from!.id, {
          data: {
            exercise: {
              name: userMessage,
            },
          },
        });
        const { month } = getUserExercise(ctx.from!.id);
        const monthNumber = validateMonths.indexOf(month) + 1;
        const data = await WorkoutQueryFetcher.getExercisesByMonthNameAndUserId(
          ctx,
          monthNumber,
        );
        if (!data.length)
          return await dataLenghtEmpty(ctx, bot!);
        const mappedData = ExerciseFetchFormatter.formatExerciseByDay(
          data,
          "getMethod",
        );
        return await BotUtils.sendBotMessage(ctx, mappedData);
      },
    };
}
