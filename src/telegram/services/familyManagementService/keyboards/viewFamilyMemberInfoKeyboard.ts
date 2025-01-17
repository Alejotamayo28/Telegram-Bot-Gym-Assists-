import { Context, Telegraf } from "telegraf";
import { getUserSelectedMember } from "../../../../userState";
import {
  InlineKeyboardMarkup,
  Message,
} from "telegraf/typings/core/types/typegram";
import { MessageTemplate } from "../../../../template/message";
import { ViewFamilyMemberCallback } from "../models";
import { WorkoutQueryFetcher } from "../../../../database/queries/exerciseQueries";
import { BotUtils } from "../../clientSignUpService/functions";
import { regexPattern, setUpKeyboardIteration } from "../../utils";
import { ClientQueryFetcher } from "../../../../database/queries/clientQueries";
import { mainMenuPage } from "../../menus/mainMenuHandler";
import { botMessages } from "../../../messages";
import { ClientDataFormatter } from "../../../../data-formatter.ts/client-info-formatter";
import { ExerciseFetchFormatter } from "../../../../data-formatter.ts/exercise-fetch-formatter";

//Menu de iteraccion con otro usuario -> (Perfil)(Historial Ejercicios)(Ejercicios Semana Pasada)
export class ViewFamilyMemberDataInlineKeyboard extends MessageTemplate {
  constructor(private ctx: Context) {
    super();
  }
  protected prepareMessage() {
    const { nickname } = getUserSelectedMember(this.ctx.from!.id);
    const message = `📂 _Estás viendo el perfil de: ${nickname.toUpperCase()}_.\n\n¿Qué te gustaría hacer a continuación?`;
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(`Historial Ejercicios`, {
            action: ViewFamilyMemberCallback.HistorialEjercicios,
          }),
          this.createButton(`Ejercicios Semana Pasada`, {
            action: ViewFamilyMemberCallback.EjerciciosSemanaPasada,
          }),
        ],
        [
          this.createButton(`Perfil`, {
            action: ViewFamilyMemberCallback.Perfil,
          }),
          this.createButton(`Volver al Inicio`, {
            action: ViewFamilyMemberCallback.Cancelar,
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
      [ViewFamilyMemberCallback.HistorialEjercicios]:
        this.handleExeriseHistory.bind(this, bot),
      [ViewFamilyMemberCallback.EjerciciosSemanaPasada]:
        this.handleExerciseLastWeek.bind(this, bot),
      [ViewFamilyMemberCallback.Perfil]: this.handleClientPerfil.bind(
        this,
        bot,
      ),
      [ViewFamilyMemberCallback.Cancelar]: this.handleCanceled.bind(
        this,
        bot,
        Message,
      ),
    };
    if (handlers[action]) {
      return await handlers[action]();
    }
  }
  private async handleExeriseHistory(bot: Telegraf) {
    const { id } = getUserSelectedMember(this.ctx.from!.id);
    const dataResponse = await WorkoutQueryFetcher.getExerciseByUserId(id);
    const mappedExercise =
      ExerciseFetchFormatter.formatClientExercises(dataResponse);
    await BotUtils.sendBotMessage(this.ctx, mappedExercise);
    const viewFamilyMemberData = new ViewFamilyMemberDataInlineKeyboard(
      this.ctx,
    );
    return await setUpKeyboardIteration(this.ctx, viewFamilyMemberData, bot, {
      callbackPattern: regexPattern(ViewFamilyMemberCallback),
    });
  }
  private async handleExerciseLastWeek(bot: Telegraf) {
    const { id } = getUserSelectedMember(this.ctx.from!.id);
    const dataResponse =
      await WorkoutQueryFetcher.getExercisesFromLastWeekByUserId(id);
    const mappedExercise = ExerciseFetchFormatter.formatExerciseByDay(
      dataResponse,
      "getMethod",
    );
    await BotUtils.sendBotMessage(this.ctx, mappedExercise);
    const viewFamilyMemberData = new ViewFamilyMemberDataInlineKeyboard(
      this.ctx,
    );
    return await setUpKeyboardIteration(this.ctx, viewFamilyMemberData, bot, {
      callbackPattern: regexPattern(ViewFamilyMemberCallback),
    });
  }
  private async handleClientPerfil(bot: Telegraf) {
    const { id } = getUserSelectedMember(this.ctx.from!.id);
    const dataResponse = await ClientQueryFetcher.getUserProfileById(id);
    const mappedExercise = ClientDataFormatter.formatClientInfo(dataResponse);
    await BotUtils.sendBotMessage(this.ctx, mappedExercise);
    const viewFamilyMemberData = new ViewFamilyMemberDataInlineKeyboard(
      this.ctx,
    );
    return await setUpKeyboardIteration(this.ctx, viewFamilyMemberData, bot, {
      callbackPattern: regexPattern(ViewFamilyMemberCallback),
    });
  }
  private async handleCanceled(bot: Telegraf, message: Message) {
    await this.ctx.deleteMessage(message.message_id);
    return await mainMenuPage(
      this.ctx,
      bot,
      botMessages.inputRequest.prompts.getMethod.succesfull,
    );
  }
}
