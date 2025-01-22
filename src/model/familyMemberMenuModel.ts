export namespace FamilyMemberMenuModel {
  export enum Callback {
    HistorialEjercicios = "historialEjercicios",
    EjerciciosSemanaPasada = "ejerciciosSemanaPasada",
    Perfil = "perfil",
    Cancelar = "cancelar",
  }
  export const Label: { [key in FamilyMemberMenuModel.Callback]: string } = {
    [Callback.HistorialEjercicios]: "📜 Historial de ejercicios",
    [Callback.EjerciciosSemanaPasada]: "📆 Ejercicios de la semana pasada",
    [Callback.Perfil]: "👤 Perfil",
    [Callback.Cancelar]: "❌ Cancelar"
  };
}
