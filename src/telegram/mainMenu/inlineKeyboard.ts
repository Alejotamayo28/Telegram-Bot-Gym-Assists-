import { Context, Telegraf } from 'telegraf';
import { InlineKeyboardMarkup, Message } from 'telegraf/typings/core/types/typegram';
import { botMessages } from '../messages';
import { MessageTemplate } from '../../template/message';
import { MainMenuCallbacks, MainMenuLabels, ReturnMainMenuCallbacks } from './models';
import { deleteBotMessage, userStageDeleteExercise, userStagePostExercise, userStagePutExercise, userStateUpdateStage } from '../../userState';
import { fetchExerciseController } from '../services/getMethod';
import { ExerciseGetHandler } from '../services/getMethod/functions';
import { BotUtils } from '../services/singUp/functions';
import { exerciseDeletionFlow } from '../services/deleteMethod';
import { exercisePostFlow } from '../services/addMethod';
import { ClientInfo } from '../../model/client';
import { mainMenuPage } from '.';
import { FamilyFlow } from '../services/family';
import { ClientQueries } from '../services/client/queries';
import { ClientDataMapped } from '../services/client/functions';
import { ClientProfileCallbacks, ClientProfileInlineKeyboard } from '../services/client/inlineKeyboard';
import { regexPattern, setUpKeyboardIteration } from '../services/utils';

// working file -->

export class MainMenuHandler extends MessageTemplate {
  protected prepareMessage() {
    const message = botMessages.menus.mainMenu
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
          this.createButton(MainMenuLabels.getExerciseHistory, { action: MainMenuCallbacks.getExerciseHistory }),
          this.createButton(MainMenuLabels.setRoutine, { action: MainMenuCallbacks.setRoutine }),
        ],
        [
          this.createButton(MainMenuLabels.userFamily, { action: MainMenuCallbacks.userFamily }),
          this.createButton(MainMenuLabels.userProfile, { action: MainMenuCallbacks.userProfile })
        ]
      ]
    }
    return { message, keyboard }
  }
  async handleOptions(ctx: Context, _: Message, action: string, bot: Telegraf) {
    await deleteBotMessage(ctx)
    const handlers: { [key: string]: () => Promise<void> } = {
      [MainMenuCallbacks.postExercise]: this.handlePostExercise.bind(this, ctx, bot),
      [MainMenuCallbacks.getExercise]: this.handleGetExercise.bind(this, ctx, bot),
      [MainMenuCallbacks.getExerciseHistory]: this.handleGetExerciseWeek.bind(this, ctx, bot),
      [MainMenuCallbacks.updateExercise]: this.handleUpdateExercise.bind(this, ctx),
      [MainMenuCallbacks.deleteExercise]: this.handleDeleteExercise.bind(this, ctx, bot),
      [MainMenuCallbacks.setRoutine]: this.handleRoutine.bind(this, ctx, bot),
      [MainMenuCallbacks.userFamily]: this.handleUserFamily.bind(this, ctx, bot),
      [MainMenuCallbacks.userProfile]: this.handleProfileUser.bind(this, ctx, bot)
    }
    if (handlers[action]) {
      return handlers[action]()
    }
  }
  private async handleGetExercise(ctx: Context, bot: Telegraf): Promise<void> {
    return await fetchExerciseController(ctx, bot)
  }
  private async handleGetExerciseWeek(ctx: Context, bot: Telegraf): Promise<void> {
    return await ExerciseGetHandler.getAllTimeExerciseText(ctx, bot)
  }
  private async handlePostExercise(ctx: Context, bot: Telegraf): Promise<void> {
    return await exercisePostFlow(ctx, bot)
  }
  private async handleUpdateExercise(ctx: Context): Promise<void> {
    await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.prompts.updateMethod.exerciseDay)
    userStateUpdateStage(ctx, userStagePutExercise.PUT_EXERCISE_DAY)
  }
  private async handleDeleteExercise(ctx: Context, bot: Telegraf): Promise<void> {
    await exerciseDeletionFlow(ctx, bot)
  }
  private async handleRoutine(ctx: Context, bot: Telegraf): Promise<void> {
    console.log(`not implemented yet`)
  }
  private async handleProfileUser(ctx: Context, bot: Telegraf) {
    const response = new ClientProfileInlineKeyboard()
    return await setUpKeyboardIteration(ctx, response, bot, {
      callbackPattern: regexPattern(ClientProfileCallbacks)
    })
  }
  private async handleUserFamily(ctx: Context, bot: Telegraf) {
    return await FamilyFlow(ctx, bot)
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
          this.createButton(MainMenuLabels.getExerciseHistory, { action: ReturnMainMenuCallbacks.returngetExerciseHistory })
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
        [ReturnMainMenuCallbacks.returngetExerciseHistory]: this.handleGetExerciseWeek.bind(this, ctx, bot),
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
    await ExerciseGetHandler.getAllTimeExerciseText(ctx, bot)
  }
  private async handlePostExercise(ctx: Context) {
    await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.prompts.postMethod.exerciseDay)
    userStateUpdateStage(ctx, userStagePostExercise.POST_EXERCISE_DAY)
  }
  private async handleUpdateExercise(ctx: Context) {
    await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.prompts.updateMethod.exerciseDay)
    userStateUpdateStage(ctx, userStagePutExercise.PUT_EXERCISE_DAY)
  }
  private async handleDeleteExercise(ctx: Context) {
    await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.prompts.deleteMethod.exerciseDay)
    userStateUpdateStage(ctx, userStageDeleteExercise.DELETE_EXERCISE_DAY)
  }
}
