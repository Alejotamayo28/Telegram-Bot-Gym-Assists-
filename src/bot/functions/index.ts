import { PoolClient, QueryResult } from "pg"
import { ClientLogin, UserData } from "../../model/client"
import { userStateWorkout, workoutOutput } from "../../model/workout"
import { escapeMarkdown } from "./markdownV2"
import { Context, Telegraf } from "telegraf"

export const deleteLastMessage = async (ctx: Context) => {
  const lastMessage = ctx.message!.message_id - 1
  if (lastMessage) {
    await ctx.deleteMessage(lastMessage)
  }
}

export class UserSession {
  private userData: ClientLogin
  private id: number
  constructor() {
    this.userData = {
      nickname: ' ',
      password: ' ',
    }
    this.id = 0
  }
  setNickname(nickname: string) {

    if (typeof nickname === 'string' && nickname.trim() !== '') {
      this.userData.nickname = nickname.trim();
    } else {
      throw new Error('Nickname inválido');
    }
  }
  getNickname() {
    return this.userData.nickname;
  }
  setPassword(password: string) {
    if (typeof password === 'string' && password.trim() !== '') {
      this.userData.password = password.trim();
    } else {
      throw new Error('Contraseña inválida');
    }
  }
  getPassword() {
    return this.userData.password;
  }
  setId(id: number) {
    this.id = id
  }
  getId() {
    return this.id
  }
  getDataLogin() {
    return this.userData
  }
  clear() {
    this.userData.nickname = '';
    this.userData.password = '';
  }
}
export const menuPageGetExercises = async (client: PoolClient, id: number) => {
  const daysOfWeek = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  const exercisesByDay: Record<string, { name: string, reps: string, kg: number }[]> = Object.fromEntries(daysOfWeek.map(day => [day, []]));

  const response: QueryResult = await client.query(
    'SELECT day, name, reps, kg FROM workout WHERE id = $1 ORDER BY day, name',
    [id]
  );

  response.rows.forEach(row => {
    const { day, name, reps, kg } = row;

    if (exercisesByDay.hasOwnProperty(day)) {
      exercisesByDay[day].push({ name, reps, kg });
    } else {
    }
  });
  return daysOfWeek
    .map(day => {
      const exercises = exercisesByDay[day];
      if (exercises.length === 0) {
        return `${day.charAt(0).toUpperCase() + day.slice(1)}:\nNo hay ejercicios`;
      }
      const formattedExercises = exercises
        .reduce((acc, exercise) => {
          const existingExercise = acc.find(e => e.name === exercise.name);
          if (existingExercise) {
            existingExercise.sets.push({ reps: exercise.reps, kg: exercise.kg });
          } else {
            acc.push({ name: exercise.name, sets: [{ reps: exercise.reps, kg: exercise.kg }] });
          }
          return acc;
        }, [] as { name: string, sets: { reps: string, kg: number }[] }[])
        .map(exercise => {
          const setsInfo = exercise.sets
            .map((set, index) => `  Set ${index + 1}: ${set.reps} reps, ${set.kg} kg`)
            .join('\n');
          return `- ${exercise.name}:\n${setsInfo}`;
        })
        .join('\n\n');

      return `${day.charAt(0).toUpperCase() + day.slice(1)}:\n${formattedExercises}`;
    })
    .join('\n\n');
};




export const validateDays = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']

export const verifyDay = (day: string) => {
  return validateDays.includes(day)
}

export const verifyExerciseOutput = (workout: workoutOutput) => {
  return `*Confirmación de ejercicio:*

🗓 *Día:* ${escapeMarkdown(workout.day!)}
💪 *Nombre:* ${escapeMarkdown(workout.name!)}
🔢 *Repeticiones:* ${escapeMarkdown(workout.reps!.toString())}
⚖️ *Peso:* ${escapeMarkdown(workout.kg!.toString())} kg

_Escoge alguna de las siguientes opciones para continuar\\!_`
}

export const verifySignUpOutput = (data: UserData) => {
  return `*Confirmación de cuenta:*

🗓 *Nickname:* ${escapeMarkdown(data.nickname!)}
💪 *Contrasena:* ${escapeMarkdown(data.password!)}
🔢 *Email:* ${escapeMarkdown(data.email)}

_Escoge alguna de las siguientes opciones para continuar\\!_`
}

export const verifyDeleteExercise = (data: workoutOutput) => {
  return `*Confirmar eliminacion:*

🗓 *Dia:* ${escapeMarkdown(data.day!)}
💪 *Nombre:* ${escapeMarkdown(data.name!)}

_Escoge alguna de las siguientes opciones para continuar\\!_`
}
export const errorMessage = (userStage: string) => {
  return `Error during ${userStage} process: `
}

export const errorMessageCtx = `Hubo un problema. Por favor, intenta nuevamente`

export const errorState = async (error: Error, userStage: string, ctx: Context) => {
  console.error(errorMessage(userStage), error)
  await ctx.reply(errorMessageCtx)
}
