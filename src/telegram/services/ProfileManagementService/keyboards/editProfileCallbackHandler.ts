import { Context } from "telegraf";

export class EditProfileCallbacksHandler {
  constructor(private ctx: Context) {}
  async handleEditNickname() {}
  async handleEditPassword() {}
  async handleEditEmail() {}
  async handleEditName() {}
  async handleEditLastName() {}
  async handleEditAge() {}
  async handleEditWeight() {}
  async handleEditHeight() {}
}
