import { Context, Telegraf } from "telegraf";
import { MessageTemplate } from "../../../../template/message";
import {
  UserCredentials,
  UserFamilyMemberResponse,
  updateUserState,
} from "../../../../userState";
import {
  familiesMethod,
  setUpKeyboardIteration,
  regexPattern,
} from "../../utils";
import { BuildFamilyInline } from "../buildFamilyInline";
import { ViewFamilyMemberCallback } from "../models";
import {
  InlineKeyboardMarkup,
  Message,
} from "telegraf/typings/core/types/typegram";
import { ViewFamilyMemberDataInlineKeyboard } from "./viewFamilyMemberInfoKeyboard";

export class ViewFamilyMembersInlineKeybaordNotWorking extends MessageTemplate {
  private selectedOption!: (ctx: Context, bot: Telegraf) => Promise<void>;
  constructor(
    private method: keyof typeof familiesMethod,
    private data: UserCredentials[],
  ) {
    super();
    this.selectedOption = this.options[this.method];
  }
  protected prepareMessage() {
    const grouppedButtons =
      BuildFamilyInline.createInlineKeyboard<UserCredentials>(
        "viewFamiliesMember",
        this.data,
      );
    console.log("Data: ", this.data);
    const message = `👤 _Estos son los integrantes de tu familia_.\n\nSelecciona a alguien para gestionar o ver más detalles`;
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: grouppedButtons,
    };
    return { message, keyboard };
  }
  public async handleOptions(
    ctx: Context,
    message: Message,
    action: string,
    bot: Telegraf,
  ): Promise<void> {
    const handlers: { [key: string]: () => Promise<void> } = {};
    this.data.forEach((family) => {
      handlers[`member_${family.nickname}`] = async () => {
        return this.options[this.method](ctx, bot, family);
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
      data?: UserFamilyMemberResponse,
    ) => Promise<void>;
  } = {
    getMethod: async (
      ctx: Context,
      bot: Telegraf,
      data?: UserFamilyMemberResponse,
    ): Promise<void> => {
      updateUserState(ctx.from!.id, {
        data: {
          selectedFamilyMember: {
            nickname: data?.nickname,
            id: data?.id,
          },
        },
      });
      const viewFamilyMemberData = new ViewFamilyMemberDataInlineKeyboard(ctx);
      return await setUpKeyboardIteration(ctx, viewFamilyMemberData, bot, {
        callbackPattern: regexPattern(ViewFamilyMemberCallback),
      });
    },
  };
}
