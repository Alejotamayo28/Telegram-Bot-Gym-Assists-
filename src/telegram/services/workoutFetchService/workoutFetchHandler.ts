import { ChartData, ChartConfiguration } from "chart.js";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { Context, Telegraf } from "telegraf";
import { deleteUserMessage, userState } from "../../../userState";
import { botMessages } from "../../messages";
import { BotUtils } from "../clientSignUpService/functions";
import { mainMenuPage } from "../menus/mainMenuHandler";
import { WorkoutQueryFetcher } from "../../../database/queries/exerciseQueries";
import { ExerciseFetchFormatter } from "../../../data-formatter.ts/exercise-fetch-formatter";

export class WorkoutFetchHandler {
  static async getExerciseByMonthAndUserId(
    ctx: Context,
    month: string,
    bot: Telegraf,
  ): Promise<void> {
    await deleteUserMessage(ctx);
    try {
      const exercise = await WorkoutQueryFetcher.getExerciseByMonthAndUserId(
        ctx.from!.id,
        month,
      );
      if (!exercise.length)
        return await mainMenuPage(
          ctx,
          bot,
          botMessages.inputRequest.prompts.getMethod.errors.exerciseEmptyData,
        );
      const formattedOutput =
        ExerciseFetchFormatter.formatExerciseByNameAndWeek(exercise);
      const formattedMonth = month.toUpperCase();
      const date = new Date();
      await BotUtils.sendBotMessage(
        ctx,
        botMessages.inputRequest.prompts.getMethod.outPut.Monthly(
          formattedMonth,
          date,
          formattedOutput,
        ),
      );
      return await mainMenuPage(
        ctx,
        bot,
        botMessages.inputRequest.prompts.getMethod.succesfull,
      );
    } catch (error) {
      console.error(`Error: `, error);
    }
  }
  static async getExerciseByDateAndUserId(
    ctx: Context,
    day: string,
    bot: Telegraf,
  ): Promise<void> {
    await deleteUserMessage(ctx);
    try {
      const { month } = userState[ctx.from!.id];
      const exercise = await WorkoutQueryFetcher.getExerciseByMonthDayAndUserId(
        ctx.from!.id,
        day,
        month,
      );
      if (!exercise.length) {
        return await mainMenuPage(
          ctx,
          bot,
          botMessages.inputRequest.prompts.getMethod.errors.exerciseEmptyData,
        );
      }
      const formattedOutput =
        ExerciseFetchFormatter.formatExerciseByNameAndWeek(exercise);
      const formattedDay = day.toUpperCase();
      const date = new Date();
      await BotUtils.sendBotMessage(
        ctx,
        botMessages.inputRequest.prompts.getMethod.outPut.Daily(
          month,
          formattedDay,
          date,
          formattedOutput,
        ),
      );
      return await mainMenuPage(
        ctx,
        bot,
        botMessages.inputRequest.prompts.getMethod.succesfull,
      );
    } catch (error) {
      console.error(`Error: `, error);
    }
  }
  static async getAllTimeExercise(
    ctx: Context,
    bot: Telegraf,
  ): Promise<void> {
    await deleteUserMessage(ctx);
    try {
      const exercise = await WorkoutQueryFetcher.getExerciseByUserId(
        ctx.from!.id,
      );
      if (!exercise.length) {
        return await mainMenuPage(
          ctx,
          bot,
          botMessages.inputRequest.prompts.getMethod.errors.exerciseEmptyData,
        );
      }
      const formattedExercises =
        ExerciseFetchFormatter.formatClientExercises(exercise);
      const date = new Date();
      await BotUtils.sendBotMessage(
        ctx,
        botMessages.inputRequest.prompts.getMethod.outPut.Alltime(
          date,
          formattedExercises,
        ),
      );
      return await mainMenuPage(
        ctx,
        bot,
        botMessages.inputRequest.prompts.getMethod.succesfull,
      );
    } catch (error) {
      console.error(`Error: `, error);
    }
  }
}

export const graphic = async (userId: number, day: string) => {
  const result = await WorkoutQueryFetcher.getExerciseByUserIdAndDay(
    userId,
    day,
  );
  const ejercicios = result.map((row) => row.name + `\n${row.weight} kg`);
  const serie1 = result.map((row) => row.reps[0] || 0);
  const serie2 = result.map((row) => row.reps[1] || 0);
  const serie3 = result.map((row) => row.reps[2] || 0);
  const width = 1000;
  const height = 600;
  const chartCallback = (ChartJS: any) => {
    (ChartJS.defaults.responsive = true),
      (ChartJS.defaults.maintainAspectRatio = false);
  };
  const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width,
    height,
    chartCallback,
  });
  const chartData: ChartData = {
    labels: ejercicios,
    datasets: [
      {
        label: "Serie 1",
        data: serie1,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Serie 2",
        data: serie2,
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
      {
        label: "Serie 3",
        data: serie3,
        backgroundColor: "rgba(153, 102, 225, 0.6)",
        borderColor: "rgba(153, 102, 225, 1)",
        borderWidth: 1,
      },
    ],
  };
  const configuration: ChartConfiguration = {
    type: "bar",
    data: chartData,
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "REPETICIONES",
          },
          ticks: {
            stepSize: 1,
          },
        },
        x: {
          title: {
            display: true,
            text: "",
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: `Ejercicios del ${day.toUpperCase()} - Máximo de Repeticiones`,
        },
        legend: {
          display: false,
        },
      },
    },
  };
  return await chartJSNodeCanvas.renderToBuffer(configuration);
};
