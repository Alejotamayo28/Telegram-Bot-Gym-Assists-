import { Context, Telegraf } from "telegraf";
import { MessageTemplate } from "../../../../template/message";
import {
  UserFamilyResponse,
  updateUserState,
  deleteBotMessage,
} from "../../../../userState";
import {
  familiesMethod,
  setUpKeyboardIteration,
  FamilyType,
} from "../../utils";
import { BuildFamilyInline } from "../../../../utils/buildFamilyInline";
import {
  InlineKeyboardMarkup,
  Message,
} from "telegraf/typings/core/types/typegram";
import { ViewFamilyMembersInlineKeybaordNotWorking } from "./viewFamilyMembersKeyboard";
import { FamilyQueryFetch } from "../../../../database/queries/familyQueries";
import { botMessages } from "../../../messages";

export class ViewFamilyInlineKeyboard extends MessageTemplate {
  private selectedOption!: (ctx: Context, bot: Telegraf) => Promise<void>;
  constructor(
    private method: keyof typeof familiesMethod,
    private data: UserFamilyResponse[],
  ) {
    super();
    this.selectedOption = this.options[this.method];
  }
  protected prepareMessage() {
    console.log(this.data);
    const grouppedButtons =
      BuildFamilyInline.createInlineKeyboard<UserFamilyResponse>(
        "viewFamilies",
        this.data,
      );
    const message = botMessages.inputRequest.prompts.familyMethod.familyBelongsTo;
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: grouppedButtons,
    };
    return { message, keyboard };
  }
  async handleOptions(
    ctx: Context,
    _: Message,
    action: string,
    bot: Telegraf,
  ): Promise<void> {
    const handlers: { [key: string]: () => Promise<void> } = {};
    this.data.forEach((family) => {
      handlers[`family_${family.family_id}`] = async () => {
        updateUserState(ctx.from!.id, {
          data: {
            family: {
              family_id: family.family_id,
            },
          },
        });
        return this.options[this.method](ctx, bot);
      };
    });
    if (handlers[action]) {
      return await handlers[action]();
    }
  }
  private options: {
    [key in keyof typeof familiesMethod]: (
      ctx: Context,
      bot: Telegraf,
    ) => Promise<void>;
  } = {
      getMethod: async (ctx: Context, bot: Telegraf): Promise<void> => {
        await deleteBotMessage(ctx);
        const responseData = await FamilyQueryFetch.getFamilyMemberByFamliyId(
          ctx.from!.id,
        );
        const response = new ViewFamilyMembersInlineKeybaordNotWorking(
          "getMethod",
          responseData,
        );
        return await setUpKeyboardIteration(ctx, response, bot, {
          callbackManualPattern: FamilyType.MEMBER,
        });
      },
    };
}
