import { Context } from "telegraf";
import { exercisesMethod } from "../telegram/services/utils";
import { Exercise, getUserExercise } from "../userState";
import { validateMonths, validateExercises } from "../validators/allowedValues";

export class ExerciseFetchFormatter {
  static formatClientExercises(data: Exercise[]): string {
    const groupedData: {
      [year: number]: {
        [mes: string]: {
          [day: string]: {
            [exercise: string]: {
              [week: number]: Exercise[];
            };
          };
        };
      };
    } = {};
    data.forEach((exercise: Exercise) => {
      const month = validateMonths[exercise.date.getMonth()];
      const year = exercise.date.getFullYear();
      if (!groupedData[year]) {
        groupedData[year] = {};
      }
      if (!groupedData[year][month]) {
        groupedData[year][month] = {};
      }
      if (!groupedData[year][month][exercise.day]) {
        groupedData[year][month][exercise.day] = {};
      }
      if (!groupedData[year][month][exercise.day][exercise.name]) {
        groupedData[year][month][exercise.day][exercise.name] = {};
      }
      if (
        !groupedData[year][month][exercise.day][exercise.name][exercise.week]
      ) {
        groupedData[year][month][exercise.day][exercise.name][exercise.week] =
          [];
      }
      groupedData[year][month][exercise.day][exercise.name][exercise.week].push(
        exercise,
      );
    });
    let result = `*🏋️ Registro de ejercicios 🏋️*\n`; // Título principal
    for (const year in groupedData) {
      for (const month in groupedData[year]) {
        result += `\n📅 *${month.toUpperCase()} ${year}*\n`;
        result += `═══════════════════\n`;
        for (const day in groupedData[year][month]) {
          result += `📆 Día: *${day}*\n`;
          //result += `----------------------------------\n`;
          for (const exercise in groupedData[year][month][day]) {
            // Inicia el bloque de código para el ejercicio actual
            result += `💪 *${exercise.toUpperCase()}*\n\`\`\`\n`;
            // Crear una tabla sin bordes para el ejercicio actual
            result += `Semana   Reps           Peso (kg)\n`;
            for (const week in groupedData[year][month][day][exercise]) {
              groupedData[year][month][day][exercise][week].forEach(
                (exercise: Exercise) => {
                  result += `${week}       ${exercise.reps.join(", ")}         ${exercise.weight}\n`;
                },
              );
            }
            result += `\`\`\`\n`;
          }
        }
      }
    }
    return result.trim();
  }
  static formatExerciseByNameDayAndWeek(
    data: Exercise[],
    ctx: Context,
    method: keyof typeof exercisesMethod,
  ): string {
    const workoutData: Required<Exercise> = getUserExercise(ctx.from!.id);
    const groupedData: { [year: number]: { [name: string]: Exercise[] } } = {};
    data.forEach((exercise: Exercise) => {
      groupedData[exercise.year] ??= {};
      groupedData[exercise.year][exercise.name] ??= [];
      groupedData[exercise.year][exercise.name].push(exercise);
    });
    const date = new Date();
    let result = `*🏋️ Registro de ejercicios - Fecha ${date.toLocaleDateString()}*\n\n`;
    result += `_Se encontraron los siguientes ejercicios:_\n`;
    result += `Método: ${exercisesMethod[method]}\n`;
    for (const year in groupedData) {
      result += `\n========================\n`;
      result += `📅 *${workoutData.month!.toUpperCase()}* _${year}_\n`;
      result += `📅 Día: _${workoutData.day?.toUpperCase()}_\n`;
      result += `🔄 Semana: _${workoutData.week}_\n`;
      result += `----------------------------------\n`;
      for (const name in groupedData[year]) {
        // Inicia el bloque de código para el ejercicio actual
        result += `💪 *${name.toUpperCase()}*\n\`\`\`\n`;
        // Encabezados de la tabla
        result += `ID       Reps           Peso (kg)\n`;
        result += `------   ------------   ---------\n`;
        // Datos del ejercicio
        groupedData[year][name].forEach((exercise: Exercise) => {
          result += `${exercise.id}       ${exercise.reps.join(", ")}         ${exercise.weight}\n`;
        });
        // Cierra el bloque de código para el ejercicio actual
        result += `\`\`\`\n`;
      }
    }
    return result.trim();
  }
  static formatExerciseByDay(
    data: Exercise[],
    method: keyof typeof exercisesMethod,
  ): string {
    const groupedData: { [day: string]: Exercise[] } = {};
    data.forEach((exercise: Exercise) => {
      groupedData[exercise.day] ??= [];
      groupedData[exercise.day].push(exercise);
    });
    const date = new Date();
    let result = `*🏋️ Registro de ejercicios - Fecha ${date.toLocaleDateString()}*\n\n`;
    result += `_Se encontraron los siguientes ejercicios:_\n`;
    result += `Método: ${exercisesMethod[method]}\n`;
    for (const day in groupedData) {
      // Inicia el bloque de código para el día actual
      result += `═══════════════════\n`;
      result += `📅 *${day.toUpperCase()}*\n`;
      result += `\`\`\`\n`;
      // Encabezados de la tabla
      result += `Ejercicio           Reps           Peso (kg)\n`;
      // Datos del día
      groupedData[day].forEach((exercise: Exercise) => {
        result += `${exercise.name}       ${exercise.reps.join(", ")}         ${exercise.weight}\n`;
      });
      // Cierra el bloque de código para el día actual
      result += `\`\`\`\n`;
    }
    return result.trim();
  }
  static formatExerciseByNameAndWeek(data: Exercise[]): string {
    const groupedData: { [exercise: string]: { [week: number]: Exercise[] } } =
      {};
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
    let result = `*🏋️ Registro de ejercicios 🏋️*\n`; // Título principal
    for (const exerciseName in groupedData) {
      // Inicia el bloque de código para el ejercicio actual
      result += `\n💪 *${exerciseName.toUpperCase()}*\n\`\`\`\n`;
      for (const week in groupedData[exerciseName]) {
        result += `🔄 Semana ${week}:\n`;
        groupedData[exerciseName][week].forEach((exercise) => {
          result += `   • Reps: ${exercise.reps.join(", ")} | Peso: ${exercise.weight} kg\n`;
        });
      }
      // Cierra el bloque de código para el ejercicio actual
      result += `\`\`\`\n`;
    }
    return result.trim();
  }
}
