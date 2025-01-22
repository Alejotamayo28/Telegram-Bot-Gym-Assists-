export namespace ExercisePostView {
  export enum Callback {
    lastWeek = "lastWeek",
    oneExercise = "oneExercise",
  }
  export const Labels: { [key in Callback]: string } = {
    [Callback.lastWeek]: `🔹 Semana pasada`,
    [Callback.oneExercise]: `🔹Seguimiento ejercicio `,
  };
}
