export namespace ConfirmationMenuModel {
  export enum Callback {
    Yes = "yes",
    No = "no",
  }
  export const Labels: { [key in Callback]: string } = {
    [Callback.Yes]: "🔹 Confirmar",
    [Callback.No]: "🔹Cancelar",
  };
}

