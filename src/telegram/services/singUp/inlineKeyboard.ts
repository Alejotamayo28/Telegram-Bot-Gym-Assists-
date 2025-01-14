import { Context, Telegraf } from "telegraf";
import { MessageTemplate } from "../../../template/message";
import { getUserCredentials } from "../../../userState";
import { verifySignUpOutput } from "../utils";
import { InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram";
import { ExerciseVerificationCallbacks, ExerciseVerificationLabels } from "../addMethod/models";
import { onTransaction } from "../../../database/dataAccessLayer";
import { insertClientQuery } from "./queries";
import { commandStart } from "../../commands/start";

export class SignUpVerificationHandler extends MessageTemplate {
  constructor(private ctx: Context, private passwordHash: string) {
    super()
  }
  userData = getUserCredentials(this.ctx.from!.id)
  protected prepareMessage() {
    const { nickname, password, email } = getUserCredentials(this.ctx.from!.id)
    const message = verifySignUpOutput({ nickname, password, email })
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(ExerciseVerificationLabels.YES, {
            action: ExerciseVerificationCallbacks.YES
          }),
          this.createButton(ExerciseVerificationLabels.NO, {
            action: ExerciseVerificationCallbacks.NO
          })
        ]
      ]
    }
    return { message, keyboard }
  }
  async handleOptions(ctx: Context, message: Message, action: string, bot: Telegraf) {
    this.ctx.deleteMessage(message.message_id)
    const handlers: { [key: string]: () => Promise<void> } = {
      [ExerciseVerificationCallbacks.YES]: this.handleYesCallback.bind(this, bot),
      [ExerciseVerificationCallbacks.NO]: this.handleNoCallback.bind(this, bot)
    }
    if (handlers[action]) {
      return handlers[action]()
    }
  }
  private async handleYesCallback(bot: Telegraf) {
    const { nickname, email } = this.userData
    await onTransaction(async (transactionClient) => {
      await insertClientQuery(this.ctx, { nickname, email }, this.passwordHash, transactionClient)
    })
    await commandStart(this.ctx, bot)
  }
  private async handleNoCallback(bot: Telegraf) {
    await commandStart(this.ctx, bot)
  }
}


