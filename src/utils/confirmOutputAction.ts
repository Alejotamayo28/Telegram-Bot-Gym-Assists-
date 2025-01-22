import { Exercise, UserCredentials } from "../userState";

export const verifyDeleteExercise = (data: Exercise) => {
  return `*Confirmar eliminacion:*

🗓 *Dia:* ${data.day}
💪 *Nombre:* ${data.name}
🔢 *Semana:* ${data.week}

_Escoge alguna de las siguientes opciones para continuar!_`;
};

export const verifySignUpOutput = (data: UserCredentials) => {
  return `*Confirmación de cuenta:*

🗓 *Nickname:* ${data.nickname}
💪 *Contrasena:* ${data.password}
🔢 *Email:* ${data.email}

_Escoge alguna de las siguientes opciones para continuar!_`;
};

export const verifyExerciseOutput = (workout: Exercise) => {
  return `*Confirmación de ejercicio:*

🗓 *Día:* ${workout.day}
💪 *Nombre:* ${workout.name}
🔢 *Repeticiones:* ${workout.reps!.toString()}
⚖️ *Peso:* ${workout.weight!.toString()} kg

_Escoge alguna de las siguientes opciones para continuar\\!_`;
};
