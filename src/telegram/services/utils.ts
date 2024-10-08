import { PoolClient, QueryResult } from "pg"
import { UserCredentials, UserProfile } from "../../model/client"
import { PartialWorkout } from "../../model/workout"
import { Context } from "telegraf"
import { onSession } from "../../database/dataAccessLayer"
import { inlineKeyboardMenu } from "../mainMenu/inlineKeyboard"
import { UserStateManager } from "../../userState"

export const verifyExerciseName = async (userMessage: string, ctx: Context) => {
  const { rowCount }: QueryResult = await onSession((transactionClient) => {
    return transactionClient.query(
      `SELECT name from workout where name = $1 and id = $2`,
      [userMessage, ctx.from!.id])
  })
  if (rowCount! > 0) {
    return true
  }
  return false
}

export const validExercises = [
  "press militar", "sentadilla", "peso muerto", "dominadas", "curl de bíceps",
  "remo con barra", "press banca", "zancadas", "press de hombros", "hip thrust",
  "remo con mancuerna", "curl martillo", "press de pecho con mancuernas", "pull-over",
  "press francés", "fondos de triceps", "jalón al pecho", "remo invertido", "elevaciones laterales",
  "extensiones de tríceps en polea", "crunch abdominal", "planchas", "elevaciones de piernas",
  "sentadilla búlgara", "peso muerto sumo", "curl de pierna", "abducción de cadera",
  "adducción de cadera", "extensión de cuádriceps", "prensa de piernas", "remo en máquina",
  "press Arnold", "levantamiento lateral con mancuernas", "pullover con mancuerna", "face pull",
  "press inclinado con mancuernas", "press de pecho en máquina", "encogimientos de hombros",
  "peso muerto rumano", "pull-up", "press de banca declinado", "patada de tríceps con mancuerna",
  "crunch en polea", "swing con kettlebell", "sentadilla con salto", "curl concentrado",
  "remo en polea baja", "press de pierna", "step-ups", "elevación frontal con mancuernas"
];

export const verifyExerciseInput = (name: string): boolean => {
  const exercise = name.toLowerCase()
  return validExercises.includes(exercise)
}

export const handleIncorrectExerciseNameInput = async (ctx: Context) => {
  return await ctx.reply(`🗓️*Nombre del entrenamiento:*🗓️

_Ejercicio no encontrado en tus datos, vuelve a escribirlo o crealo!_`, {
    parse_mode: "Markdown",
    reply_markup: inlineKeyboardMenu.reply_markup
  })
}

export const deleteLastMessage = async (ctx: Context) => {
  const lastMessage = ctx.message?.message_id ? ctx.message.message_id - 1 : undefined;
  if (lastMessage) {
    await ctx.deleteMessage(lastMessage)
  }
}

export const deleteLastMessages = async (ctx: Context) => {
  const userManager = new UserStateManager(ctx.from!.id)
  userManager.updateData({ lastMessageId: ctx.message?.message_id })
  const lastBotMessageId = userManager.getUserProfile().lastMessageId
  const lastUserMessageId = ctx.message?.message_id;
  try {
    if (lastBotMessageId !== undefined) {
      await ctx.deleteMessage(lastBotMessageId);  // Eliminar el mensaje del bot
    }
    if (lastUserMessageId !== undefined) {
      await ctx.deleteMessage(lastUserMessageId);  // Eliminar el mensaje del usuario
    }
  } catch (error) {
    console.error("Error deleting messages:", error);
  }
};



export class UserSession {
  private UserProfile: UserCredentials
  private id: number
  constructor() {
    this.UserProfile = {
      nickname: ' ',
      password: ' ',
    }
    this.id = 0
  }
  setNickname(nickname: string) {

    if (typeof nickname === 'string' && nickname.trim() !== '') {
      this.UserProfile.nickname = nickname.trim();
    } else {
      throw new Error('Nickname inválido');
    }
  }
  getNickname() {
    return this.UserProfile.nickname;
  }
  setPassword(password: string) {
    if (typeof password === 'string' && password.trim() !== '') {
      this.UserProfile.password = password.trim();
    } else {
      throw new Error('Contraseña inválida');
    }
  }
  getPassword() {
    return this.UserProfile.password;
  }
  setId(id: number) {
    this.id = id
  }
  getId() {
    return this.id
  }
  getDataLogin() {
    return this.UserProfile
  }
  clear() {
    this.UserProfile.nickname = '';
    this.UserProfile.password = '';
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



export const verifyExerciseOutput = (workout: PartialWorkout) => {
  return `*Confirmación de ejercicio:*

🗓 *Día:* ${escapeMarkdown(workout.day!)}
💪 *Nombre:* ${escapeMarkdown(workout.name!)}
🔢 *Repeticiones:* ${escapeMarkdown(workout.reps!.toString())}
⚖️ *Peso:* ${escapeMarkdown(workout.kg!.toString())} kg

_Escoge alguna de las siguientes opciones para continuar\\!_`
}

export const verifySignUpOutput = (data: UserProfile) => {
  return `*Confirmación de cuenta:*

🗓 *Nickname:* ${escapeMarkdown(data.nickname!)}
💪 *Contrasena:* ${escapeMarkdown(data.password!)}
🔢 *Email:* ${escapeMarkdown(data.email)}

_Escoge alguna de las siguientes opciones para continuar\\!_`
}

export const verifyDeleteExercise = (data: PartialWorkout) => {
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


export function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}


