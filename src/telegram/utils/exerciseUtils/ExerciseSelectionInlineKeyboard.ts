import { Context, Telegraf } from "telegraf";
import { MessageTemplate } from "../../../template/message";
import { Exercise} from "../../../userState";
import {
  InlineKeyboardMarkup,
  Message,
} from "telegraf/typings/core/types/typegram";
import { exercisesMethod} from "../../services/utils";
import { ExerciseSelectionCallackHandler } from "./ExerciseSelectionCallbackHandler";
import { groupedButtonsFunction } from "../../../utils/buildExerciseInline";

let response: number[] = [];
let messagesId: number[] = [];

export class ExerciseSelectionInlineKeyboard extends MessageTemplate {
  private handleCallback: ExerciseSelectionCallackHandler;
  private selectedOption!: (ctx: Context, bot: Telegraf) => Promise<void>;
  constructor(
    private ctx: Context,
    private method: keyof typeof exercisesMethod,
    private messagge: string,
    private data: Exercise[],
  ) {
    super();
    this.selectedOption = this.options[this.method];
    this.handleCallback = new ExerciseSelectionCallackHandler(this.ctx);
  }
  protected prepareMessage() {
    const groupedButtons = groupedButtonsFunction(this.data);
    const message = this.messagge;
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: groupedButtons,
    };
    return { message, keyboard };
  }
  async handleOptions(
    ctx: Context,
    message: Message,
    action: string,
    bot: Telegraf,
  ): Promise<void> {
    const handlers: { [key: string]: () => Promise<any> } = {};
    this.data.forEach((exercise) => {
      handlers[exercise.id] = async () => {
        const message = await ctx.reply(
          `✅ *Has seleccionado el ejercicio:* _${exercise.name}_\n🆔 *ID del ejercicio:* _${exercise.id}_\n`,
          {
            parse_mode: "Markdown",
          },
        );
        messagesId.push(message.message_id);
        response.push(exercise.id);
      };
    });
    if (action == `continuar`) {
      messagesId.forEach(async (i: number) => {
        await ctx.deleteMessage(i);
      });
      await ctx.deleteMessage(message.message_id);
      return this.options[this.method](ctx, bot);
    }
    if (handlers[action]) {
      return handlers[action]();
    }
  }
  private options: {
    [key in keyof typeof exercisesMethod]: (
      ctx: Context,
      bot: Telegraf,
    ) => Promise<void>;
  } = {
      deleteMethod: async (_: Context, bot: Telegraf): Promise<void> => {
        this.handleCallback.deleteMethod(bot, response);
      },
      getMethod: async (): Promise<void> => { },
      updateMethod: async (): Promise<void> => {
        this.handleCallback.updateMethod(messagesId, response);
      },
    };
}
