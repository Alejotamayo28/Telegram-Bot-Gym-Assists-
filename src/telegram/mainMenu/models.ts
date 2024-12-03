export enum MainMenuCallbacks {
  postExercise = 'postExercise',
  updateExercise = 'updateExercise',
  getExercise = 'getExercise',
  getExerciseWeek = 'getExerciseWeek',
  deleteExercise = 'deleteExercise'
}

export const MainMenuLabels: { [key in MainMenuCallbacks]: string } = {
  [MainMenuCallbacks.postExercise]: "💪 Agregar ejercicio",
  [MainMenuCallbacks.updateExercise]: "🔄 Actualizar ejercicio",
  [MainMenuCallbacks.getExercise]: "📅 Obtener ejercicios",
  [MainMenuCallbacks.getExerciseWeek]: "📅 Obtener ejercicios semanales",
  [MainMenuCallbacks.deleteExercise]: "❌ Eliminar ejercicio"
}

export enum ReturnMainMenuCallbacks {
  returnpostExercise = 'postExercise',
  returnupdateExercise = 'updateExercise',
  returngetExercise = 'getExercise',
  returngetExerciseWeek = 'getExerciseWeek',
  returndeleteExercise = 'deleteExercise'
}


