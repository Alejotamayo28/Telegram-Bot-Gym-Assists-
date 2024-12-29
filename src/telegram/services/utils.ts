import { UserCredentials, UserProfile } from "../../model/client"
import { Exercise, PartialWorkout } from "../../model/workout"
import { Context, Telegraf } from "telegraf"
import { InlineKeyboardButton, Message } from "telegraf/typings/core/types/typegram"
import { saveBotMessage } from "../../userState"
import { CallbackData } from "../../template/message"

export const exercisesMethod = {
  deleteMethod: `Eliminar`,
}

export interface KeyboardResponse {
  sendCompleteMessage: (ctx: Context) => Promise<Message>;
  handleOptions: (ctx: Context, message: Message, action: string, bot: Telegraf) => Promise<void>;
}

export const handleKeyboardStep = async (ctx: Context, keyboard: KeyboardResponse, bot: Telegraf, callbackPattern?: RegExp, nextStep?: () => Promise<any>):
  Promise<void> => {
  const message = await keyboard.sendCompleteMessage(ctx);
  saveBotMessage(ctx, message.message_id);
  if (callbackPattern) {
    bot.action(callbackPattern, async (ctx) => {
      const action = ctx.match[0];
      await tryCatch(() => keyboard.handleOptions(ctx, message, action, bot), ctx);
      if (nextStep) await nextStep();
    });
  } else {
    bot.action(/.*/, async (ctx) => {
      const action = ctx.match[0];
      await tryCatch(() => keyboard.handleOptions(ctx, message, action, bot), ctx);
      if (nextStep) await nextStep();
    });
  }
}

export const createButton = (text: string, callbackData: CallbackData): InlineKeyboardButton => { return {
    text,
    callback_data: callbackData.action
  }
}

export const lastButton = createButton(`• Continuar`, { action: `continuar` })
export const groupedButtonsFunction = (data: Exercise[]) => {
  const response = data.reduce((rows: InlineKeyboardButton[][], exercise: Exercise, index: number) => {
    const button = createButton(`• Id: ${exercise.id} | ${exercise.name}`, { action: `${exercise.id}` });
    if (index % 2 === 0) {
      rows.push([button]);
    } else {
      rows[rows.length - 1].push(button);
    }
    return rows
  },
    [])
  response.push([lastButton])
  return response
}


// regetPattern para las acciones del usuario, parametro = enum
export const regexPattern = <T extends { [key: string]: string }>(optionsEnum: T) => {
  return new RegExp(`^(${Object.values(optionsEnum).join('|')})$`)
}

export const tryCatch = async (fn: () => Promise<void | Message>, ctx: Context) => {
  try {
    return await fn()
  } catch (error) {
    console.error(`Error: `, error)
    await ctx.reply(`An error ocurred. Please try again.`)
  }
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


export const deleteLastMessage = async (ctx: Context) => {
  const lastMessage = ctx.message?.message_id ? ctx.message.message_id - 1 : undefined;
  if (lastMessage) {
    await ctx.deleteMessage(lastMessage)
  }
}

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

🗓 *Nickname:* ${data.nickname}
💪 *Contrasena:* ${data.password}
🔢 *Email:* ${data.email}

_Escoge alguna de las siguientes opciones para continuar!_`
}

export const verifyDeleteExercise = (data: PartialWorkout) => {
  return `*Confirmar eliminacion:*

🗓 *Dia:* ${data.day}
💪 *Nombre:* ${data.name}
🔢 *Semana:* ${data.week}

_Escoge alguna de las siguientes opciones para continuar!_`
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



