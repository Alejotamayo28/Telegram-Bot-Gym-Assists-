export enum ExerciseViewOption {
  lastWeek = 'lastWeek',
  oneExercise = 'oneExercise',
}

export const EXERCISE_VIEW_LABELS: { [key in ExerciseViewOption]: string } = {
  [ExerciseViewOption.lastWeek]: `🔹 Semana pasada`,
  [ExerciseViewOption.oneExercise]: `🔹Seguimiento ejercicio `,
};


export const ExerciseFetchGraphTextLabels = {
  GRAPHIC: '🔹 Grafico',
  TEXT: '🔹 Texto'
}

export enum ExerciseFetchGraphTextOptions {
  GRAPHIC = 'grafico',
  TEXT = 'texto'
}
