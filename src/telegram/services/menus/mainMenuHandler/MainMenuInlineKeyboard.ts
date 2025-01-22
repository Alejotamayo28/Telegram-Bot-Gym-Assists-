import { Context, Telegraf } from "telegraf";
import {
  InlineKeyboardMarkup,
  Message,
} from "telegraf/typings/core/types/typegram";
import { botMessages } from "../../../messages";
import { MessageTemplate } from "../../../../template/message";
import { deleteBotMessage } from "../../../../userState";
import { MainMenuCallbackHandler } from "./MainMenuInlineCallbackHandler";
import { mainMenuModel } from "../../../../model/mainMenuModel";

export class MainMenuHandler extends MessageTemplate {
  protected prepareMessage() {
    const message = botMessages.menus.mainMenu;
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(mainMenuModel.Label.postExercise, {
            action: mainMenuModel.Callback.postExercise,
          }),
          this.createButton(mainMenuModel.Label.getExercise, {
            action: mainMenuModel.Callback.getExercise,
          }),
        ],
        [
          this.createButton(mainMenuModel.Label.updateExercise, {
            action: mainMenuModel.Callback.updateExercise,
          }),
          this.createButton(mainMenuModel.Label.deleteExercise, {
            action: mainMenuModel.Callback.deleteExercise,
          }),
        ],
        [
          this.createButton(mainMenuModel.Label.getExerciseHistory, {
            action: mainMenuModel.Callback.getExerciseHistory,
          }),
          this.createButton(mainMenuModel.Label.setRoutine, {
            action: mainMenuModel.Callback.setRoutine,
          }),
        ],
        [
          this.createButton(mainMenuModel.Label.userFamily, {
            action: mainMenuModel.Callback.userFamily,
          }),
          this.createButton(mainMenuModel.Label.userProfile, {
            action: mainMenuModel.Callback.userProfile,
          }),
        ],
      ],
    };
    return { message, keyboard };
  }
  async handleOptions(ctx: Context, _: Message, action: string, bot: Telegraf) {
    console.log('handleOptionCallback: ', action)
    await deleteBotMessage(ctx);
    const handleCallback = new MainMenuCallbackHandler()
    const handlers: { [key: string]: () => Promise<void> } = {
      [mainMenuModel.Callback.postExercise]: async () =>
        handleCallback.handlePostExerciseMenu(ctx, bot),
      [mainMenuModel.Callback.getExercise]: async () =>
        handleCallback.hanleFetchExerciseMenu(ctx, bot),
      [mainMenuModel.Callback.getExerciseHistory]: async () =>
        handleCallback.handleFetchExerciseRecord(ctx, bot),
      [mainMenuModel.Callback.updateExercise]: async () =>
        handleCallback.handleUpdateExerciseMenu(ctx, bot),
      [mainMenuModel.Callback.deleteExercise]: async () =>
        handleCallback.handleDeleteExercise(ctx, bot),
      [mainMenuModel.Callback.setRoutine]: async () =>
        handleCallback.handleRoutineMenu(),
      [mainMenuModel.Callback.userFamily]: async () =>
        handleCallback.handlerFamiyMenu(ctx, bot),
      [mainMenuModel.Callback.userProfile]: async () =>
        handleCallback.handleProfileMenu(ctx, bot),
    };
    return handlers[action]();
  }
}
