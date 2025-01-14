import { Context, Telegraf } from 'telegraf';
import { InlineKeyboardMarkup, Message } from 'telegraf/typings/core/types/typegram';
import { botMessages } from '../messages';
import { MessageTemplate } from '../../template/message';
import { MainMenuCallbacks, MainMenuLabels} from './models';
import { deleteBotMessage} from '../../userState';
import { fetchExerciseController } from '../services/getMethod';
import { ExerciseGetHandler } from '../services/getMethod/functions';
import { exerciseDeleteFlow } from '../services/deleteMethod';
import { exercisePostFlow } from '../services/addMethod';
import { FamilyFlow } from '../services/family';
import { ClientProfileCallbacks, ClientProfileInlineKeyboard } from '../services/client/inlineKeyboard';
import { regexPattern, setUpKeyboardIteration } from '../services/utils';
import { exerciseUpdateFlow } from '../services/updateMethod';

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
      [MainMenuCallbacks.updateExercise]: this.handleUpdateExercise.bind(this, ctx, bot),
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
  private async handleUpdateExercise(ctx: Context, bot: Telegraf): Promise<void> {
    return await exerciseUpdateFlow(ctx, bot)
  }
  private async handleDeleteExercise(ctx: Context, bot: Telegraf): Promise<void> {
    await exerciseDeleteFlow(ctx, bot)
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

