import { Exercise, PartialWorkout } from "../../../model/workout";
import { ChartData, ChartConfiguration } from "chart.js";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { ExerciseQueryFetcher } from "./queries";
import { validateExercises, validateMonths } from "../../../validators/allowedValues";
import { Context, Telegraf } from "telegraf";
import { deleteUserMessage, userStageGetExercise, userState, userStateUpdateMonth } from "../../../userState";
import { botMessages } from "../../messages";
import { BotUtils } from "../singUp/functions";
import { redirectToMainMenuWithTaskDone } from "../../mainMenu";

export class ExerciseGetHandler {
  static async exerciseMonth(ctx: Context, userMessage: string): Promise<void> {
    await deleteUserMessage(ctx)
    const month = userMessage.toLowerCase()
    userStateUpdateMonth(ctx, month, userStageGetExercise.GET_EXERCISE_DAY)
    await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.prompts.getMethod.exerciseDay)
  }
  static async getMonthlyExerciseText(ctx: Context, month: string, bot: Telegraf): Promise<void> {
    await deleteUserMessage(ctx)
    try {
      const exercise = await ExerciseQueryFetcher.ExerciseByIdAndMonth(ctx.from!.id, month)
      if (!exercise.length) return await redirectToMainMenuWithTaskDone(ctx, bot, botMessages.inputRequest.prompts.getMethod.errors.exerciseEmptyData)
      const formattedOutput = ExerciseGetUtils.mapExercisesByNameAndWeek(exercise)
      const formattedMonth = month.toUpperCase()
      const date = new Date()
      await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.prompts.getMethod.outPut.Monthly(formattedMonth, date, formattedOutput))
      return await redirectToMainMenuWithTaskDone(ctx, bot, botMessages.inputRequest.prompts.getMethod.succesfull)
    } catch (error) {
      console.error(`Error: `, error)
    }
  }
  static async getDailyExerciseText(ctx: Context, day: string, bot: Telegraf): Promise<void> {
    await deleteUserMessage(ctx)
    try {
      const { month } = userState[ctx.from!.id]
      const exercise = await ExerciseQueryFetcher.ExerciseByIdAndDayAndMonth(ctx.from!.id, day, month)
      if (!exercise.length) return await redirectToMainMenuWithTaskDone(ctx, bot, botMessages.inputRequest.prompts.getMethod.errors.exerciseEmptyData)
      const formattedOutput = ExerciseGetUtils.mapExercisesByNameAndWeek(exercise)
      const formattedDay = day.toUpperCase()
      const date = new Date()
      await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.prompts.getMethod.outPut.Daily(month, formattedDay, date, formattedOutput))
      return await redirectToMainMenuWithTaskDone(ctx, bot, botMessages.inputRequest.prompts.getMethod.succesfull)
    } catch (error) {
      console.error(`Error: `, error)
    }
  }
  static async getAllTimeExerciseText(ctx: Context, bot: Telegraf): Promise<void> {
    await deleteUserMessage(ctx)
    try {
      const exercise = await ExerciseQueryFetcher.ExerciseById(ctx.from!.id)
      if (!exercise.length) return await redirectToMainMenuWithTaskDone(ctx, bot, botMessages.inputRequest.prompts.getMethod.errors.exerciseEmptyData)
      const formattedExercises = ExerciseGetUtils.mapAllTimeExercises(exercise)
      const date = new Date()
      await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.prompts.getMethod.outPut.Alltime(date, formattedExercises))
      return await redirectToMainMenuWithTaskDone(ctx, bot, botMessages.inputRequest.prompts.getMethod.succesfull)
    } catch (error) {
      console.error(`Error: `, error)
    }
  }
}

export class ExerciseGetUtils {
  static mapAllTimeExercises(data: Exercise[]): string {
    const groupedData: { [year: number]: { [mes: string]: { [day: string]: { [exercise: string]: { [week: number]: Exercise[] } } } } } = {}
    data.forEach((exercise: Exercise) => {
      const month = validateMonths[exercise.date.getMonth()]
      const year = exercise.date.getFullYear()
      if (!groupedData[year]) {
        groupedData[year] = {}
      }
      if (!groupedData[year][month]) {
        groupedData[year][month] = {}
      }
      if (!groupedData[year][month][exercise.day]) {
        groupedData[year][month][exercise.day] = {}
      }
      if (!groupedData[year][month][exercise.day][exercise.name]) {
        groupedData[year][month][exercise.day][exercise.name] = {}
      }
      if (!groupedData[year][month][exercise.day][exercise.name][exercise.week]) {
        groupedData[year][month][exercise.day][exercise.name][exercise.week] = []
      }
      groupedData[year][month][exercise.day][exercise.name][exercise.week].push(exercise)
    })
    let result = ""
    for (const year in groupedData) {
      for (const month in groupedData[year]) {
        result += `\n========================\n📅 *${month.toUpperCase()}* _${year}_ \n`
        for (const day in groupedData[year][month]) {
          result += `\n🔄 Día: _${day.toUpperCase()}_\n----------------------------------\n\n`;
          for (const exercise in groupedData[year][month][day]) {
            result += `💪 Ejercicio: _${exercise.toUpperCase()}\n_`;
            for (const week in groupedData[year][month][day][exercise]) {
              result += `   🔢 Semana _${week}:_\n`;
              groupedData[year][month][day][exercise][week].forEach((exercise: Exercise) => {
                result += `      • _Reps:_ ${exercise.reps.join(', ')} | _Peso:_ ${exercise.kg} kg\n`;
              })
            }
          }
        }
      }
    }
    return result.trim()
  }
  static mapExerciseByNameDayWeekTESTING(data: Exercise[], ctx: Context): string {
    const workoutData: PartialWorkout = userState[ctx.from!.id]
    const groupedData: { [year: number]: Exercise[] } = {}
    data.forEach((exercise: Exercise) => {
      groupedData[exercise.year] ??= []
      groupedData[exercise.year].push(exercise)
    })
    let result = `_Se encontraron los siguientes ejercicios:_\n`
    for (const year in groupedData) {
      result += `\n========================\n📅 *${workoutData.month!.toUpperCase()}* _${year}_\n
🔄 Dia: _${workoutData.day?.toUpperCase()}_
📅 Semana: _${workoutData.week}_\n----------------------------------\n`
      groupedData[year].forEach((exercise: Exercise) => {
        result += `     • id: ${exercise.id}  |  _Reps_:  ${exercise.reps.join(', ')}  |  _Peso:_  ${exercise.kg}\n`
      })
    }
    return result.trim()
  }
  static mapExercisesByNameAndWeek(data: Exercise[]): string {
    const groupedData: { [exercise: string]: { [week: number]: Exercise[] } } = {}
    data.forEach((exercise: Exercise) => {
      if (validateExercises.includes(exercise.name)) {
        if (!groupedData[exercise.name]) {
          groupedData[exercise.name] = {};
        }
        if (!groupedData[exercise.name][exercise.week]) {
          groupedData[exercise.name][exercise.week] = [];
        }
        groupedData[exercise.name][exercise.week].push(exercise);
      }
    });
    let result = ""
    for (const exerciseName in groupedData) {
      result += `\n💪 Ejercicio: ${exerciseName.toUpperCase()}\n\n`
      for (const week in groupedData[exerciseName]) {
        result += `🔄 Semana ${week}:\n`
        groupedData[exerciseName][week].forEach((exercise) => {
          result += `    - Reps: ${exercise.reps.join(' ')} | Peso: ${exercise.kg}\n`
        })
      }
    }
    return result.trim()
  }
}

export const graphic = async (userId: number, day: string) => {
  const result = await ExerciseQueryFetcher.ExerciseByIdAndDay(userId, day)
  const ejercicios = result.map(row => row.name + `\n${row.kg} kg`)
  const serie1 = result.map(row => row.reps[0] || 0)
  const serie2 = result.map(row => row.reps[1] || 0)
  const serie3 = result.map(row => row.reps[2] || 0)
  const width = 1000
  const height = 600
  const chartCallback = (ChartJS: any) => {
    ChartJS.defaults.responsive = true,
      ChartJS.defaults.maintainAspectRatio = false;
  }
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });
  const chartData: ChartData = {
    labels: ejercicios,
    datasets: [
      {
        label: 'Serie 1',
        data: serie1,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Serie 2',
        data: serie2,
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1
      },
      {
        label: 'Serie 3',
        data: serie3,
        backgroundColor: 'rgba(153, 102, 225, 0.6)',
        borderColor: 'rgba(153, 102, 225, 1)',
        borderWidth: 1
      }
    ]
  };
  const configuration: ChartConfiguration = {
    type: 'bar',
    data: chartData,
    options:
    {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'REPETICIONES'
          },
          ticks: {
            stepSize: 1
          }
        },
        x: {
          title: {
            display: true,
            text: ''
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: `Ejercicios del ${day.toUpperCase()} - Máximo de Repeticiones`,
        },
        legend: {
          display: false
        },
      }
    }
  };
  return await chartJSNodeCanvas.renderToBuffer(configuration)
}



