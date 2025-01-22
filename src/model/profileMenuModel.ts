export namespace ProfileMenuModel {
  export enum Callback {
    fetchProfile = "fetchProfile",
    editProfile = "editProfile",
  }

  export const Label: { [key in ProfileMenuModel.Callback]: string } = {
    [Callback.fetchProfile]: "👤 Ver perfil",
    [Callback.editProfile]: "✍️ Editar perfil"
  };
}
