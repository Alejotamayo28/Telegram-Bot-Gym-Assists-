export namespace FamilyMenuModel {
  export enum Callback {
    viewFamily = `viewFamily`,
    createFamily = `createFamily`,
    joinFamily = "joinFamily",
  }
  export const Label: { [key in FamilyMenuModel.Callback]: string } = {
    [Callback.viewFamily]: "👨 Ver familia",
    [Callback.createFamily]: "🏠 Crear familia",
    [Callback.joinFamily]: "🤝 Unirse a familia",
  };
}
