import { Context, Telegraf } from "telegraf";
import { getUserSelectedMember } from "../../../../userState";
import { WorkoutQueryFetcher } from "../../../../database/queries/exerciseQueries";
import { ExerciseFetchFormatter } from "../../../../data-formatter.ts/exercise-fetch-formatter";
import { BotUtils } from "../../../../utils/botUtils";
import { ViewFamilyMemberDataInlineKeyboard } from "./viewFamilyMemberInfoKeyboard";
import { FamilyMemberMenuModel } from "../../../../model/familyMemberMenuModel";
import { regexPattern, setUpKeyboardIteration } from "../../utils";
import { ClientDataFormatter } from "../../../../data-formatter.ts/client-info-formatter";
import { ClientQueryFetcher } from "../../../../database/queries/clientQueries";
import { Message } from "telegraf/typings/core/types/typegram";
import { botMessages } from "../../../messages";
import { mainMenuPage } from "../../menus/mainMenuHandler/mainMenuController";

export class viewFamilyMemberCallbackHandler {
  constructor(private ctx: Context) { }
  async handleExerciseHistory(bot: Telegraf) {
    const { id } = getUserSelectedMember(this.ctx.from!.id);
    const dataResponse = await WorkoutQueryFetcher.getExerciseByUserId(id);
    const mappedExercise =
      ExerciseFetchFormatter.formatClientExercises(dataResponse);
    await BotUtils.sendBotMessage(this.ctx, mappedExercise);
    const viewFamilyMemberData = new ViewFamilyMemberDataInlineKeyboard(
      this.ctx,
    );
    return await setUpKeyboardIteration(this.ctx, viewFamilyMemberData, bot, {
      callbackPattern: regexPattern(FamilyMemberMenuModel.Callback),
    });
  }
  async handleExerciseLastWeek(bot: Telegraf) {
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
      callbackPattern: regexPattern(FamilyMemberMenuModel.Callback),
    });
  }
  async handleClientProfile(bot: Telegraf) {
    const { id } = getUserSelectedMember(this.ctx.from!.id);
    const dataResponse = await ClientQueryFetcher.getUserProfileById(id);
    const mappedExercise = ClientDataFormatter.formatClientInfo(dataResponse);
    await BotUtils.sendBotMessage(this.ctx, mappedExercise);
    const viewFamilyMemberData = new ViewFamilyMemberDataInlineKeyboard(
      this.ctx,
    );
    return await setUpKeyboardIteration(this.ctx, viewFamilyMemberData, bot, {
      callbackPattern: regexPattern(FamilyMemberMenuModel.Callback),
    });
  }
  async handleCanceled(bot: Telegraf, message: Message) {
    await this.ctx.deleteMessage(message.message_id);
    return await mainMenuPage(
      this.ctx,
      bot,
      botMessages.inputRequest.prompts.getMethod.succesfull,
    );
  }
}
