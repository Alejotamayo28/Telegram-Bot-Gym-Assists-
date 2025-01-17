import { Context, Telegraf } from "telegraf";
import { MessageTemplate } from "../../../template/message";
import { verifyExerciseOutput } from "../utils";
import {
  InlineKeyboardMarkup,
  Message,
} from "telegraf/typings/core/types/typegram";
import { deleteBotMessage, getUserExercise } from "../../../userState";
import {
  ExerciseVerificationCallbacks,
  ExerciseVerificationLabels,
} from "./models";
import { mainMenuPage } from "../menus/mainMenuHandler";
import { botMessages } from "../../messages";
import {
  WorkoutQueryInsert,
} from "../../../database/queries/exerciseQueries";

export class ExercisePostVerificationHandler extends MessageTemplate {
  constructor(private ctx: Context) {
    super();
  }
  workoutData = getUserExercise(this.ctx.from!.id);
  protected prepareMessage() {
    const message = verifyExerciseOutput(this.workoutData);
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(ExerciseVerificationLabels.YES, {
            action: ExerciseVerificationCallbacks.YES,
          }),
          this.createButton(ExerciseVerificationLabels.NO, {
            action: ExerciseVerificationCallbacks.NO,
          }),
        ],
      ],
    };
    return { message, keyboard };
  }
  async handleOptions(_: Context, __: Message, action: string, bot: Telegraf) {
    await deleteBotMessage(this.ctx);
    const handlers: { [key: string]: () => Promise<void> } = {
      [ExerciseVerificationCallbacks.YES]: this.handleYesCallback.bind(
        this,
        bot,
      ),
      [ExerciseVerificationCallbacks.NO]: this.handleNoCallback.bind(this, bot),
    };
    if (handlers[action]) {
      return handlers[action]();
    }
  }
  private async handleResponseCallback(bot: Telegraf, message: string) {
    try {
      return await mainMenuPage(this.ctx, bot, message);
    } catch (error) {
      console.error(`Error: `, error);
    }
  }
  private async handleYesCallback(bot: Telegraf) {
    await WorkoutQueryInsert.insertExerciseByUserId(this.ctx.from!.id);
    return await this.handleResponseCallback(
      bot,
      botMessages.inputRequest.prompts.postMethod.successful,
    );
  }
  private async handleNoCallback(bot: Telegraf) {
    return await this.handleResponseCallback(
      bot,
      botMessages.inputRequest.prompts.postMethod.notSuccessful,
    );
  }
}

