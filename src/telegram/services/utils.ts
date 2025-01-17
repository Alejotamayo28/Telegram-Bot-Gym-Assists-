import { Context, Telegraf } from "telegraf";
import {
  InlineKeyboardButton,
  Message,
} from "telegraf/typings/core/types/typegram";
import { CallbackData } from "../../template/message";
import { Exercise, saveBotMessage, UserCredentials } from "../../userState";

export enum FamilyType {
  MEMBER = "member",
  FAMILY = "family",
  EDIIT_PROFILE = "editProfile",
}

type ValidatePattern = `${FamilyType}_${string}`;

type KeyboardHandlerOptionsTest = {
  callbackPattern?: RegExp;
  callbackManualPattern?: FamilyType;
  nextStep?: () => Promise<void>;
};

function isValidPattern(pattern: string): pattern is ValidatePattern {
  return Object.values(FamilyType).some((type) =>
    pattern.startsWith(`${type}_`),
  );
}

export interface KeyboardResponse {
  sendCompleteMessage: (ctx: Context) => Promise<Message>;
  handleOptions: (
    ctx: Context,
    message: Message,
    action: string,
    bot: Telegraf,
  ) => Promise<void>;
}

export const setUpKeyboardIteration = async (
  ctx: Context,
  keyboard: KeyboardResponse,
  bot: Telegraf,
  options: KeyboardHandlerOptionsTest,
) => {
  const message = await keyboard.sendCompleteMessage(ctx);
  await saveBotMessage(ctx, message.message_id);
  const pattern =
    options.callbackPattern ||
    (options.callbackManualPattern
      ? new RegExp(`^${options.callbackManualPattern}_.*`)
      : /.*/);
  bot.action(pattern, async (actionCtx) => {
    const action = actionCtx.match[0];
    /*  if (!options.callbackPattern) {
         if (!isValidPattern(action)) {
           throw new Error(`Invalid pattern: ${action}`)
         }
       }
       */
    await tryCatch(
      () => keyboard.handleOptions(ctx, message, action, bot),
      ctx,
    );
    if (options.nextStep) {
      await options.nextStep();
    }
  });
};

export const exercisesMethod = {
  deleteMethod: `Eliminar`,
  getMethod: `Obtener`,
  updateMethod: "Actualizar",
};

export const familiesMethod = {
  getMethod: "Obtener",
};

export const createButton = (
  text: string,
  callbackData: CallbackData,
): InlineKeyboardButton => {
  return {
    text,
    callback_data: callbackData.action,
  };
};

export const lastButton = createButton(`• Continuar`, { action: `continuar` });

export const groupedButtonsFunction = (data: Exercise[]) => {
  const response = data.reduce(
    (rows: InlineKeyboardButton[][], exercise: Exercise, index: number) => {
      const button = createButton(`• Id: ${exercise.id} | ${exercise.name}`, {
        action: `${exercise.id}`,
      });
      if (index % 2 === 0) {
        rows.push([button]);
      } else {
        rows[rows.length - 1].push(button);
      }
      return rows;
    },
    [],
  );
  response.push([lastButton]);
  return response;
};

// regetPattern para las acciones del usuario, parametro = enum
export const regexPattern = <T extends { [key: string]: string }>(
  optionsEnum: T,
) => {
  return new RegExp(`^(${Object.values(optionsEnum).join("|")})$`);
};

export const tryCatch = async (
  fn: () => Promise<void | Message>,
  ctx: Context,
) => {
  try {
    return await fn();
  } catch (error) {
    console.error(`Error: `, error);
    await ctx.reply(`An error ocurred. Please try again.`);
  }
};

export const validExercises = [
  "press militar",
  "sentadilla",
  "peso muerto",
  "dominadas",
  "curl de bíceps",
  "remo con barra",
  "press banca",
  "zancadas",
  "press de hombros",
  "hip thrust",
  "remo con mancuerna",
  "curl martillo",
  "press de pecho con mancuernas",
  "pull-over",
  "press francés",
  "fondos de triceps",
  "jalón al pecho",
  "remo invertido",
  "elevaciones laterales",
  "extensiones de tríceps en polea",
  "crunch abdominal",
  "planchas",
  "elevaciones de piernas",
  "sentadilla búlgara",
  "peso muerto sumo",
  "curl de pierna",
  "abducción de cadera",
  "adducción de cadera",
  "extensión de cuádriceps",
  "prensa de piernas",
  "remo en máquina",
  "press Arnold",
  "levantamiento lateral con mancuernas",
  "pullover con mancuerna",
  "face pull",
  "press inclinado con mancuernas",
  "press de pecho en máquina",
  "encogimientos de hombros",
  "peso muerto rumano",
  "pull-up",
  "press de banca declinado",
  "patada de tríceps con mancuerna",
  "crunch en polea",
  "swing con kettlebell",
  "sentadilla con salto",
  "curl concentrado",
  "remo en polea baja",
  "press de pierna",
  "step-ups",
  "elevación frontal con mancuernas",
];

export const deleteLastMessage = async (ctx: Context) => {
  const lastMessage = ctx.message?.message_id
    ? ctx.message.message_id - 1
    : undefined;
  if (lastMessage) {
    await ctx.deleteMessage(lastMessage);
  }
};

export const verifyExerciseOutput = (workout: Exercise) => {
  return `*Confirmación de ejercicio:*

🗓 *Día:* ${workout.day}
💪 *Nombre:* ${workout.name}
🔢 *Repeticiones:* ${workout.reps!.toString()}
⚖️ *Peso:* ${workout.weight!.toString()} kg

_Escoge alguna de las siguientes opciones para continuar\\!_`;
};

export const verifySignUpOutput = (data: UserCredentials) => {
  return `*Confirmación de cuenta:*

🗓 *Nickname:* ${data.nickname}
💪 *Contrasena:* ${data.password}
🔢 *Email:* ${data.email}

_Escoge alguna de las siguientes opciones para continuar!_`;
};

export const verifyDeleteExercise = (data: Exercise) => {
  return `*Confirmar eliminacion:*

🗓 *Dia:* ${data.day}
💪 *Nombre:* ${data.name}
🔢 *Semana:* ${data.week}

_Escoge alguna de las siguientes opciones para continuar!_`;
};
export const errorMessage = (userStage: string) => {
  return `Error during ${userStage} process: `;
};

export function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}
