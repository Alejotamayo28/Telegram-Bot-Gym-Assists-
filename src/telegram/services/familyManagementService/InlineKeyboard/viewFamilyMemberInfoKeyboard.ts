import { Context, Telegraf } from "telegraf";
import { getUserSelectedMember } from "../../../../userState";
import {
  InlineKeyboardMarkup,
  Message,
} from "telegraf/typings/core/types/typegram";
import { MessageTemplate } from "../../../../template/message";
import { FamilyMemberMenuModel } from "../../../../model/familyMemberMenuModel";
import { viewFamilyMemberCallbackHandler } from "./viewFamilyMemberHandleCallback";

export class ViewFamilyMemberDataInlineKeyboard extends MessageTemplate {
  private handleCallback: viewFamilyMemberCallbackHandler;
  constructor(private ctx: Context) {
    super();
    this.handleCallback = new viewFamilyMemberCallbackHandler(this.ctx);
  }
  protected prepareMessage() {
    const { nickname } = getUserSelectedMember(this.ctx.from!.id);
    const message = `📂 _Estás viendo el perfil de: ${nickname.toUpperCase()}_.\n\n¿Qué te gustaría hacer a continuación?`;
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(FamilyMemberMenuModel.Label.historialEjercicios, {
            action: FamilyMemberMenuModel.Callback.HistorialEjercicios,
          }),
          this.createButton(
            FamilyMemberMenuModel.Label.ejerciciosSemanaPasada,
            {
              action: FamilyMemberMenuModel.Callback.EjerciciosSemanaPasada,
            },
          ),
        ],
        [
          this.createButton(FamilyMemberMenuModel.Label.perfil, {
            action: FamilyMemberMenuModel.Callback.Perfil,
          }),
          this.createButton(FamilyMemberMenuModel.Label.cancelar, {
            action: FamilyMemberMenuModel.Callback.Cancelar,
          }),
        ],
      ],
    };
    return { message, keyboard };
  }
  async handleOptions(
    _: Context,
    Message: Message,
    action: string,
    bot: Telegraf,
  ) {
    const handlers: { [key: string]: () => Promise<void> } = {
      [FamilyMemberMenuModel.Callback.HistorialEjercicios]: async () =>
        this.handleCallback.handleExerciseHistory(bot),
      [FamilyMemberMenuModel.Callback.EjerciciosSemanaPasada]: async () =>
        this.handleCallback.handleExerciseLastWeek(bot),
      [FamilyMemberMenuModel.Callback.Perfil]: async () =>
        this.handleCallback.handleClientProfile(bot),
      [FamilyMemberMenuModel.Callback.Cancelar]: async () =>
        this.handleCallback.handleCanceled(bot, Message),
    };
    return await handlers[action]();
  }
}
