export enum MainMenuCallbacks {
  postExercise = 'postExercise',
  updateExercise = 'updateExercise',
  getExercise = 'getExercise',
  getExerciseHistory = 'getExerciseHistory',
  deleteExercise = 'deleteExercise',
  setRoutine = 'setRoutine',
  userProfile = 'userProfile',
  userFamily = 'userFamily'

}

export const MainMenuLabels: { [key in MainMenuCallbacks]: string } = {
  [MainMenuCallbacks.postExercise]: "💪 Agregar ejercicio",
  [MainMenuCallbacks.updateExercise]: "🔄 Actualizar ejercicio",
  [MainMenuCallbacks.getExercise]: "📅 Obtener ejercicios",
  [MainMenuCallbacks.getExerciseHistory]: "📅 Obtener registro ejercicios",
  [MainMenuCallbacks.deleteExercise]: "❌ Eliminar ejercicio",
  [MainMenuCallbacks.setRoutine]: "💪 Rutina",
  [MainMenuCallbacks.userFamily]: "💪 Familia ",
  [MainMenuCallbacks.userProfile]: "🔄 Perfil"
}

export enum ReturnMainMenuCallbacks {
  returnpostExercise = 'postExercise',
  returnupdateExercise = 'updateExercise',
  returngetExercise = 'getExercise',
  returngetExerciseHistory = 'getExerciseHistory',
  returndeleteExercise = 'deleteExercise',
  returnSetRoutine = 'setRoutine'
}


