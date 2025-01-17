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
    let result = `*Registro ejercicios* `;
    for (const year in groupedData) {
      for (const month in groupedData[year]) {
        result += `\n========================\n📅 *${month.toUpperCase()}* _${year}_ \n`;
        for (const day in groupedData[year][month]) {
          result += `🔄 Día: _${day.toUpperCase()}_\n----------------------------------\n`;
          for (const exercise in groupedData[year][month][day]) {
            result += `💪 Ejercicio: _${exercise.toUpperCase()}\n_`;
            for (const week in groupedData[year][month][day][exercise]) {
              result += `   🔢 Semana _${week}:_\n`;
              groupedData[year][month][day][exercise][week].forEach(
                (exercise: Exercise) => {
                  result += `      • _Reps:_ ${exercise.reps.join(", ")} | _Peso:_ ${exercise.weight} kg\n`;
                },
              );
            }
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
    let result = `*Registro ejercicios - Fecha ${date.toLocaleDateString()}*\n\n_Se encontraron los siguientes ejercicios:_\nMetodo: ${exercisesMethod[method]}`;
    for (const year in groupedData) {
      result += `\n========================\n📅 * ${workoutData.month!.toUpperCase()}* _${year} _
📅 Dia: _${workoutData.day?.toUpperCase()} _
🔄 Semana: _${workoutData.week} _\n----------------------------------\n`;
      for (const name in groupedData[year]) {
        result += `  🔢 _Ejercicio: ${name.toUpperCase()}: _\n`;
        groupedData[year][name].forEach((exercise: Exercise) => {
          result += `     • id: ${exercise.id}  | _Reps_:  ${exercise.reps.join(", ")}  | _Peso:_  ${exercise.weight} \n`;
        });
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
    let result = `*Registro ejercicios - Fecha ${date.toLocaleDateString()}*\n\n_Se encontraron los siguientes ejercicios:_\nMetodo: ${exercisesMethod[method]}`;
    for (const day in groupedData) {
      result += `\n========================\n📅 * ${day.toUpperCase()}*\n----------------------------------\n`;
      groupedData[day].forEach((exercise: Exercise) => {
        result += `     •  ${exercise.name}  |  _Reps_:  ${exercise.reps.join(", ")}  | _Peso:_  ${exercise.weight} \n`;
      });
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
    let result = "";
    for (const exerciseName in groupedData) {
      result += `\n💪 Ejercicio: ${exerciseName.toUpperCase()} \n\n`;
      for (const week in groupedData[exerciseName]) {
        result += `🔄 Semana ${week}: \n`;
        groupedData[exerciseName][week].forEach((exercise) => {
          result += `    - Reps: ${exercise.reps.join(" ")} | Peso: ${exercise.weight} \n`;
        });
      }
    }
    return result.trim();
  }
}
