import { PoolClient, QueryResult } from "pg";
import { PartialWorkout } from "../../../model/workout";
import { Context } from "telegraf";
import { handleExerciseNotFound } from "../../../telegram/services/updateMethod/functions";
import { onSession } from "../../../database/dataAccessLayer";
import { validateDays } from "../utils";
import { ChartData, ChartConfiguration } from "chart.js";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";

export const handleOutputDailyExercise = (data: QueryResult<PartialWorkout>): String => {
  let result = ""
  data.rows.map((i: any) => {
    let kg: number = i.kg
    result += `
_Nombre:_ ${i.name}
_Reps:_ ${i.reps}
_Peso:_ ${Math.trunc(kg)}\n`
  })
  return result
}

export const findExercisesByDay = async (client: PoolClient, day: string, id: number):
  Promise<QueryResult<PartialWorkout>> => {
  const response: QueryResult = await client.query(
    `SELECT name, reps, kg FROM workout WHERE id = $1 and day = $2`,
    [id, day])
  return response
}

export const handleGetWeeklyExercises = async (ctx: Context) => {
  const exercise = await onSession(async (clientTransaction) => {
    return findWeeklyExercises(clientTransaction, ctx.from!.id)
  })
  if (!exercise) {
    await handleExerciseNotFound(ctx)
    await ctx.deleteMessage()
    return
  }
  const formattedExercises = mapWeeklyExercise(exercise)
  await ctx.reply(formattedExercises, {
    parse_mode: 'MarkdownV2'
  })
}

const findWeeklyExercises = async (client: PoolClient, userId: number) => {
  const response: QueryResult = await client.query(
    `SELECT day, name, reps, kg FROM workout WHERE id = $1 ORDER BY  name`, [userId])
  return response.rowCount ? response.rows : null
}

interface Ejercicio {
  name: string,
  day: string,
  reps: any,
  kg: number
}

export const mapWeeklyExercise = (data: Ejercicio[]) => {
  const groupedExercises: { [day: string]: Ejercicio[] } = {}
  data.forEach((exercise: Ejercicio) => {
    if (validateDays.includes(exercise.day)) {
      if (!groupedExercises[exercise.day]) {
        groupedExercises[exercise.day] = [];
      }
      groupedExercises[exercise.day].push(exercise);
    }
  });
  let result = "";
  validateDays.forEach((day) => {
    if (groupedExercises[day]) {
      result += `
*Dia:*\\ _${day}_\n`.toUpperCase();
      groupedExercises[day].forEach((exercise) => {
        result += `
_Nombre:_ ${exercise.name}
_Reps:_ ${exercise.reps}
_Peso:_ ${Math.trunc(exercise.kg)}\n`;
      });
    }
  });
  return result.trim()
}

export const graphic = async (userId: number, day: string) => {
  const result = await onSession(async (clientTransaction) => {
    return clientTransaction.query(`
    SELECT day, name, reps, kg
    FROM workout
    WHERE id = $1
    AND day = $2
  `, [userId, day]);
  })
  const ejercicios = result.rows.map(row => row.name + `\n${row.kg} kg`)
  const serie1 = result.rows.map(row => row.reps[0] || 0)
  const serie2 = result.rows.map(row => row.reps[1] || 0)
  const serie3 = result.rows.map(row => row.reps[2] || 0)
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



