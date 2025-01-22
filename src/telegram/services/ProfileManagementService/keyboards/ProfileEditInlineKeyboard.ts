import { Context, Telegraf } from "telegraf";
import { MessageTemplate } from "../../../../template/message";
import {
  BotStage,
  deleteBotMessage,
  updateUserStage,
  updateUserState,
} from "../../../../userState";
import { botMessages } from "../../../messages";
import {
  InlineKeyboardMarkup,
  Message,
} from "telegraf/typings/core/types/typegram";
import { ProfileEditMenuModel } from "../../../../model/profileEditMenuModel";
import { BotUtils } from "../../../../utils/botUtils";

export class EditProfileInlineKeyboard extends MessageTemplate {
  constructor(private ctx: Context) {
    super();
  }
  prepareMessage() {
    const message =
      botMessages.inputRequest.prompts.profile.editProfileMenuMessage;
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton("Nickname", {
            action: ProfileEditMenuModel.Callback.NICKNAME,
          }),
          this.createButton("Contrasena", {
            action: ProfileEditMenuModel.Callback.PASSWORD,
          }),
          this.createButton("Email", {
            action: ProfileEditMenuModel.Callback.EMAIL,
          }),
        ],
        [
          this.createButton("Nombre", {
            action: ProfileEditMenuModel.Callback.NAME,
          }),
          this.createButton("Apellido", {
            action: ProfileEditMenuModel.Callback.LAST_NAME,
          }),
          this.createButton("Edad", {
            action: ProfileEditMenuModel.Callback.AGE,
          }),
        ],
        [
          this.createButton("Peso", {
            action: ProfileEditMenuModel.Callback.WEIGHT,
          }),
          this.createButton("Altura", {
            action: ProfileEditMenuModel.Callback.HEIGHT,
          }),
        ],
      ],
    };
    return { message, keyboard };
  }
  async handleOptions(
    _: Context,
    __: Message,
    action: string,
  ) {
    try {
      await deleteBotMessage(this.ctx);
      updateUserState(this.ctx.from!.id, {
        data: {
          editProfile: {
            action: action,
          },
        },
      });
      await BotUtils.sendBotMessage(
        this.ctx,
        `📋 Por favor, registra el nuevo valor que deseas actualizar. Recuerda: el peso debe estar en kilogramos (kg) y la altura en centímetros (cm).\n¡Gracias!`,
      );
      return updateUserStage(this.ctx.from!.id, BotStage.EditProfile.TESTING);
    } catch (error) {
      console.error(`Error handling action ${action}: `, action);
    }
  }
}
