import { Context, Markup, Telegraf } from 'telegraf';
import { DELETE_EXERCISE_BUTTON, DELETE_EXERCISE_CALLBACK, GET_EXERCISE_DAY_BUTTON, GET_EXERCISE_DAY_CALLBACK, GET_EXERCISE_WEEK_BUTTON, GET_EXERCISE_WEEK_CALLBACK, POST_EXERCISE_BUTTON, POST_EXERCISE_CALLBACK, UPDATE_EXERCISE_BUTTON, UPDATE_EXERCISE_CALLBACK } from '../mainMenu/buttons';
import { InlineKeyboardMarkup, Message } from 'telegraf/typings/core/types/typegram';
import { MAIN_MENU_MESSAGE } from '../messages/mainMenuMessage';
import { MessageTemplate } from '../../template/message';
import { MainMenuCallbacks, MainMenuLabels, ReturnMainMenuCallbacks, ReturnMainMenuLabels } from './models';
import { POST_EXERCISE_DAY_OUTPUT } from './messages';
import { userStageDeleteExercise, userStagePostExercise, userStagePutExercise, userStateUpdateStage } from '../../userState';
import { fetchExerciseController, handleGetWeeklyExercises } from '../services/getMethod';
import { bot } from '../bot';
import { UPDATE_EXERCISE_DAY_OUTPUT } from '../services/updateMethod/message';
import { DELETE_EXERICISE_DAY } from '../services/deleteMethod/messages';
import { sendMenuFunctions } from '../menus/userMenu';
import { mainMenuPage, returnMainMenuPage } from '.';

export class ReturnMainMenuHandler extends MessageTemplate {
  protected prepareMessage() {
    const message = ``
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(ReturnMainMenuLabels.returnMenu, { action: ReturnMainMenuCallbacks.returnMenu })
        ]
      ]
    }
    return { message, keyboard }
  }
  async handleOptions(ctx: Context, message: Message, action: string, bot: Telegraf) {
    ctx.deleteMessage(message.message_id)
    const handlers: { [key: string]: () => Promise<void> } = {
      [ReturnMainMenuCallbacks.returnMenu]: this.handleReturnMenu.bind(this, ctx, bot)
    }
    if (handlers[action]) {
      return handlers[action]()
    }
  }
  private async handleReturnMenu(ctx: Context, bot: Telegraf) {
    await mainMenuPage(ctx, bot)
  }
}


export class MainMenuHandler extends MessageTemplate {
  protected prepareMessage() {
    const message = MAIN_MENU_MESSAGE
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(MainMenuLabels.postExercise, { action: MainMenuCallbacks.postExercise }),
          this.createButton(MainMenuLabels.getExercise, { action: MainMenuCallbacks.getExercise }),
        ],
        [
          this.createButton(MainMenuLabels.updateExercise, { action: MainMenuCallbacks.updateExercise }),
          this.createButton(MainMenuLabels.deleteExercise, { action: MainMenuCallbacks.deleteExercise })
        ],
        [
          this.createButton(MainMenuLabels.getExerciseWeek, { action: MainMenuCallbacks.getExerciseWeek })
        ]
      ]
    }
    return { message, keyboard }
  }
  async handleOptions(ctx: Context, message: Message, action: string) {
    ctx.deleteMessage(message.message_id)
    const handlers: { [key: string]: () => Promise<void> } = {
      [MainMenuCallbacks.postExercise]: this.handlePostExercise.bind(this, ctx),
      [MainMenuCallbacks.getExercise]: this.handleGetExercise.bind(this, ctx, bot),
      [MainMenuCallbacks.getExerciseWeek]: this.handleGetExerciseWeek.bind(this, ctx),
      [MainMenuCallbacks.updateExercise]: this.handleUpdateExercise.bind(this, ctx),
      [MainMenuCallbacks.deleteExercise]: this.handleDeleteExercise.bind(this, ctx)
    }
    if (handlers[action]) {
      return handlers[action]()
    }
  }
  private async handleGetExercise(ctx: Context, bot: Telegraf) {
    await fetchExerciseController(ctx, bot)
  }
  private async handleGetExerciseWeek(ctx: Context) {
    await handleGetWeeklyExercises(ctx)
    await returnMainMenuPage(ctx, bot)
  }
  private async handlePostExercise(ctx: Context) {
    await ctx.reply(POST_EXERCISE_DAY_OUTPUT, {
      parse_mode: "MarkdownV2",
    })
    userStateUpdateStage(ctx, userStagePostExercise.POST_EXERCISE_DAY)
  }
  private async handleUpdateExercise(ctx: Context) {
    await ctx.reply(UPDATE_EXERCISE_DAY_OUTPUT, {
      parse_mode: "MarkdownV2"
    })
    userStateUpdateStage(ctx, userStagePutExercise.PUT_EXERCISE_DAY)
  }
  private async handleDeleteExercise(ctx: Context) {
    await ctx.reply(DELETE_EXERICISE_DAY, {
      parse_mode: "Markdown"
    })
    userStateUpdateStage(ctx, userStageDeleteExercise.DELETE_EXERCISE_DAY)
  }
}


export const inlineKeyboardMenu = Markup.inlineKeyboard([
  [
    Markup.button.callback(`📝 ${POST_EXERCISE_BUTTON}`, POST_EXERCISE_CALLBACK),
    Markup.button.callback(`🔄 ${UPDATE_EXERCISE_BUTTON}`, UPDATE_EXERCISE_CALLBACK)
  ],
  [
    Markup.button.callback(`📅 ${GET_EXERCISE_DAY_BUTTON}`, GET_EXERCISE_DAY_CALLBACK),
    Markup.button.callback(`📆 ${GET_EXERCISE_WEEK_BUTTON}`, GET_EXERCISE_WEEK_CALLBACK)
  ],
  [Markup.button.callback(`🗑️ ${DELETE_EXERCISE_BUTTON}`, DELETE_EXERCISE_CALLBACK)],
])


