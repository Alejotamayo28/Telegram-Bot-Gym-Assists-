export namespace ProfileEditMenuModel {
  export enum Callback {
    NICKNAME = "NICKNAME",
    PASSWORD = "PASSWORD",
    EMAIL = "EMAIL",
    NAME = "NAME",
    LAST_NAME = "LAST_NAME",
    AGE = "AGE",
    WEIGHT = "WEIGHT",
    HEIGHT = "HEIGHT",
  }
  export const Label: { [key in ProfileEditMenuModel.Callback]: string } = {
    [Callback.NICKNAME]: "✏️ Apodo",
    [Callback.PASSWORD]: "🔒 Contraseña",
    [Callback.EMAIL]: "📧 Correo",
    [Callback.NAME]: "📝 Nombre",
    [Callback.LAST_NAME]: "📝 Apellido",
    [Callback.AGE]: "🎂 Edad",
    [Callback.WEIGHT]: "⚖️ Peso",
    [Callback.HEIGHT]: "📏 Altura",
  };
}
