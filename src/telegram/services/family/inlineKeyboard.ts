import { Context, Telegraf } from "telegraf"
import { MessageTemplate } from "../../../template/message"
import { buildFamilyInlineKeyboard, familiesMethod, groupedFamilyButtons, handleKeyboardStep, handleKeyboardStepTest, viewFamilesController, viewFamilyMembersController } from "../utils"
import { familyInterface } from "../../../model/family"
import { InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram"
import { deleteBotMessage, saveBotMessage, userStageCreateFamily, userState, userStateUpdateFamilyId, userStateUpdateFamilyMemberId, userStateUpdateStage } from "../../../userState"
import { ClientCredentialsAndFamily } from "../../../model/client"
import { FamilyInlinekeyboardAction } from "./models"

/* How does it work? ->
1. Main Menu (FamilyInlineKeybaord):
  - If the user clicks on 'Familias' the main menu keyboard is displayed. 
    Familias ->
    This menu will offer multiple features (some are still under development) :
    - `Visualizar familas`: shows another inline keyboard (ViewFamilyInlineKeybaord):
    A welcome message is displayed along with the inline keyboard.
    The keyboard dynamically generates options based on the families the user belongs to.
      - Once a family is selected, a third keyboard is displayed with the members of the selected family
  - If ther user click on 'Crear familia' a following questions will be displayed:
    - Nombre de la familia
    - Contrasena de la familia
    (Automaticamente el usuario que haya creado una familia sera insertado en aquella familia)

Sumarry:
This module handles the inline keyboard navigation for the families service, allowing users to interactively view and manage their families and members.

*/

//MENU FAMILIAS
export class FamilyInlineKeyboard extends MessageTemplate {
  constructor(private ctx: Context) { super() }
  protected prepareMessage() {
    const message = `menu de familias, en preparacion y todavia no esta full implementado`
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(`Visualizar familias`, { action: FamilyInlinekeyboardAction.viewFamily }),
          this.createButton(`Crear familia`, { action: FamilyInlinekeyboardAction.createFamily })
        ]
      ]
    }
    return { message, keyboard }
  } async handleOptions(_: Context, __: Message, action: string, bot: Telegraf) {
    await deleteBotMessage(this.ctx)
    const handler: { [key: string]: () => Promise<void> } = {
      [FamilyInlinekeyboardAction.viewFamily]: this.handleViewFamilies.bind(this, bot),
      [FamilyInlinekeyboardAction.createFamily]: this.handleCreateFamily.bind(this, bot)
    }
    if (handler[action]) {
      return handler[action]()
    }
  }
  private async handleViewFamilies(bot: Telegraf) {
    return await viewFamilesController(this.ctx, bot)
  }
  private async handleCreateFamily(bot: Telegraf) {
    const message = await this.ctx.reply(`digita el nombre de tu familia...:`)
    saveBotMessage(this.ctx, message.message_id)
    return userStateUpdateStage(this.ctx, userStageCreateFamily.POST_FAMILY_NAME)
  }
}

//MENU VER FAMILIAS
export class ViewFamilyInlineKeyboard extends MessageTemplate {
  private selectedOption!: (ctx: Context, bot: Telegraf) => Promise<void>
  constructor(private method: keyof typeof familiesMethod, private data: familyInterface[]) {
    super()
    this.selectedOption = this.options[this.method]
  }
  protected prepareMessage() {
    const grouppedButtons = groupedFamilyButtons(this.data)
    const message = `estas son las familias a las cuales perteneces...`
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: grouppedButtons
    }
    return { message, keyboard }
  }
  async handleOptions(ctx: Context, message: Message, action: string, bot: Telegraf): Promise<void> {
    const handlers: { [key: string]: () => Promise<void> } = {}
    this.data.forEach(family => {
      handlers[`family_${family.id}`] = async () => {
        userStateUpdateFamilyId(ctx, family.id)
        return this.options[this.method](ctx, bot)
      }
    })
    if (handlers[action]) {
      return await handlers[action]()
    }
  }
  private options: { [key in keyof typeof familiesMethod]: (ctx: Context, bot: Telegraf) => Promise<void> } = {
    getMethod: async (ctx: Context, bot: Telegraf): Promise<void> => {
      return await viewFamilyMembersController(ctx, bot)
    }
  }
}

//MENU VER MIEMBROS DE LA FAMILIA
export class ViewFamilyMembersInlineKeybaordNotWorking extends MessageTemplate {
  private selectedOption!: (ctx: Context, bot: Telegraf) => Promise<void>
  constructor(private method: keyof typeof familiesMethod, private data: ClientCredentialsAndFamily[]) {
    super()
    this.selectedOption = this.options[this.method]
  }
  protected prepareMessage() {
    const grouppedButtons = buildFamilyInlineKeyboard(this.data)
    const message = `Estos son los integrantes de tu familia:...`
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: grouppedButtons
    }
    return { message, keyboard }
  }
  public async handleOptions(ctx: Context, message: Message, action: string, bot: Telegraf): Promise<void> {
    const handlers: { [key: string]: () => Promise<void> } = {}
    this.data.forEach(family => {
      handlers[`member_${family.nickname}`] = async () => {
        return this.options[this.method](ctx, bot, family.nickname)
      }
    })
    if (handlers[action]) {
      return await handlers[action]()
    }
  }
  private options: { [key in keyof typeof familiesMethod]: (ctx: Context, bot: Telegraf, nickname?: string) => Promise<void> } = {
    getMethod: async (ctx: Context, bot: Telegraf, nickname?: string): Promise<void> => {
      await ctx!.reply(`hola has seleccionado al usuario de tu familia: ${nickname}`)
    }
  }
}


