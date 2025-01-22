export namespace mainMenuModel {
  export enum Callback {
    postExercise = "postExercise",
    updateExercise = "updateExercise",
    getExercise = "getExercise",
    getExerciseHistory = "getExerciseHistory",
    deleteExercise = "deleteExercise",
    setRoutine = "setRoutine",
    userProfile = "userProfile",
    userFamily = "userFamily",
  }
  export const Label: { [key in mainMenuModel.Callback]: string } = {
    [Callback.postExercise]: "💪 Agregar ejercicio",
    [Callback.updateExercise]: "🔄 Actualizar ejercicio",
    [Callback.getExercise]: "📅 Obtener ejercicios",
    [Callback.getExerciseHistory]: "📅 Obtener registro ejercicios",
    [Callback.deleteExercise]: "❌ Eliminar ejercicio",
    [Callback.setRoutine]: "💪 Rutina",
    [Callback.userProfile]: "💪 Perfil",
    [Callback.userFamily]: "🔄 Familia",
  };
}
