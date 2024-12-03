import { Context, Telegraf } from 'telegraf';
import { InlineKeyboardMarkup, Message } from 'telegraf/typings/core/types/typegram';
import { MAIN_MENU_MESSAGE } from '../messages/mainMenuMessage';
import { MessageTemplate } from '../../template/message';
import { MainMenuCallbacks, MainMenuLabels, ReturnMainMenuCallbacks } from './models';
import { POST_EXERCISE_DAY_OUTPUT } from './messages'; import { deleteBotMessage, userStageDeleteExercise, userStagePostExercise, userStagePutExercise, userStateUpdateStage } from '../../userState';
import { fetchExerciseController, handleGetWeeklyExercises } from '../services/getMethod';
import { UPDATE_EXERCISE_DAY_OUTPUT } from '../services/updateMethod/message';
import { DELETE_EXERICISE_DAY } from '../services/deleteMethod/messages';

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
  async handleOptions(ctx: Context, _: Message, action: string, bot: Telegraf) {
    try {
      deleteBotMessage(ctx)
      const handlers: { [key: string]: () => Promise<void> } = {
        [MainMenuCallbacks.postExercise]: this.handlePostExercise.bind(this, ctx),
        [MainMenuCallbacks.getExercise]: this.handleGetExercise.bind(this, ctx, bot),
        [MainMenuCallbacks.getExerciseWeek]: this.handleGetExerciseWeek.bind(this, ctx, bot),
        [MainMenuCallbacks.updateExercise]: this.handleUpdateExercise.bind(this, ctx),
        [MainMenuCallbacks.deleteExercise]: this.handleDeleteExercise.bind(this, ctx)
      }
      if (handlers[action]) {
        return handlers[action]()
      }
    } catch (error) {
      console.error(`Error MainMenuHandler: `, error)
    }
  }
  private async handleGetExercise(ctx: Context, bot: Telegraf): Promise<void> {
    return await fetchExerciseController(ctx, bot)
  }
  private async handleGetExerciseWeek(ctx: Context, bot: Telegraf) {
    await handleGetWeeklyExercises(ctx, bot)
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

export class MainMenuHandlerWithTaskDone extends MessageTemplate {
  protected prepareMessage() {
    const message = this.taskDone!
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(MainMenuLabels.postExercise, { action: ReturnMainMenuCallbacks.returnpostExercise }),
          this.createButton(MainMenuLabels.getExercise, { action: ReturnMainMenuCallbacks.returngetExercise }),
        ],
        [
          this.createButton(MainMenuLabels.updateExercise, { action: ReturnMainMenuCallbacks.returnupdateExercise }),
          this.createButton(MainMenuLabels.deleteExercise, { action: ReturnMainMenuCallbacks.returndeleteExercise })
        ],
        [
          this.createButton(MainMenuLabels.getExerciseWeek, { action: ReturnMainMenuCallbacks.returngetExerciseWeek })
        ]
      ]
    }
    return { message, keyboard }
  }
  async handleOptions(ctx: Context, _: Message, action: string, bot: Telegraf) {
    try {
      deleteBotMessage(ctx)
      const handlers: { [key: string]: () => Promise<void> } = {
        [ReturnMainMenuCallbacks.returnpostExercise]: this.handlePostExercise.bind(this, ctx),
        [ReturnMainMenuCallbacks.returngetExercise]: this.handleGetExercise.bind(this, ctx, bot),
        [ReturnMainMenuCallbacks.returngetExerciseWeek]: this.handleGetExerciseWeek.bind(this, ctx, bot),
        [ReturnMainMenuCallbacks.returnupdateExercise]: this.handleUpdateExercise.bind(this, ctx),
        [ReturnMainMenuCallbacks.returndeleteExercise]: this.handleDeleteExercise.bind(this, ctx)
      }
      if (handlers[action]) {
        return handlers[action]()
      }
    } catch (error) {
      console.error(`Error MainMenuHandlerWithTaskDone: `, error)
    }
  }
  private async handleGetExercise(ctx: Context, bot: Telegraf) {
    return await fetchExerciseController(ctx, bot)
  }
  private async handleGetExerciseWeek(ctx: Context, bot: Telegraf) {
    await handleGetWeeklyExercises(ctx, bot)
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
