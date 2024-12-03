import { Exercise } from "../../../model/workout";
import { validateDays } from "../utils";
import { ChartData, ChartConfiguration } from "chart.js";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { ExerciseQueryFetcher } from "./queries";
import { validateExercises } from "../../../validators/allowedValues";
import { Context } from "telegraf";
import { deleteUserMessage, userStateUpdateDay, userStateUpdateMonth } from "../../../userState";

export const handleGetExerciseMonth = async (ctx: Context, userMessage: string): Promise<void> => {
  const month = userMessage.toLowerCase()
  userStateUpdateMonth(ctx, month, 'stage')
  await deleteUserMessage(ctx)
  await ctx.reply(`Escribe el dia en el cual realizaste el ejercicio`, {
    parse_mode: "Markdown"
  })
}

export const handleGetExerciseDay = async (ctx: Context, userMessage: string): Promise<void> => {
  const day = userMessage.toLowerCase()
  userStateUpdateDay(ctx, day, 'stage')
  await deleteUserMessage(ctx)

}

export const handleOutputDailyExercise = (data: Exercise[]): String => {
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

//Should be monthly
export const mapWeeklyExercise = (data: Exercise[]) => {
  const groupedData: { [day: string]: { [exercise: string]: { [week: number]: Exercise[] } } } = {}
  data.forEach((exercise: Exercise) => {
    if (validateDays.includes(exercise.day)) {
      if (!groupedData[exercise.day]) {
        groupedData[exercise.day] = {}
      }
      if (!groupedData[exercise.day][exercise.name]) {
        groupedData[exercise.day][exercise.name] = {}
      }
      if (!groupedData[exercise.day][exercise.name][exercise.week]) {
        groupedData[exercise.day][exercise.name][exercise.week] = []
      }
      groupedData[exercise.day][exercise.name][exercise.week].push(exercise)
    }
  })
  let result = "";
  for (const day in groupedData) {
    result += `\n========================\n🔄 *Día: ${day.toUpperCase()}*\n========================\n\n`;

    for (const exercise in groupedData[day]) {
      result += `💪 *Ejercicio: ${exercise}\n*`;

      for (const week in groupedData[day][exercise]) {
        result += `   🔢 *Semana ${week}:*\n`;

        groupedData[day][exercise][week].forEach((exercise) => {
          result += `      • _Reps:_ ${exercise.reps.join(', ')} | _Peso:_ ${exercise.kg} kg\n`;
        });
      }
    }
  }
  return testing(data);
}
const validateMonths = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
export const testing = (data: Exercise[]) => {
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
          result += `💪 Ejercicio: _${exercise}\n_`;
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



