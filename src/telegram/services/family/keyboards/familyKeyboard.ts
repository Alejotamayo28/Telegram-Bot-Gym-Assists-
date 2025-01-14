import { Context, Telegraf } from "telegraf"
import { MessageTemplate } from "../../../../template/message"
import { familiesMethod, FamilyType, regexPattern, setUpKeyboardIteration } from "../../utils"
import { InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram"
import { BotStage, deleteBotMessage, getUserSelectedMember, updateUserStage, updateUserState, UserFamilyMemberResponse, UserFamilyResponse } from "../../../../userState"
import { ClientCredentialsAndFamily } from "../../../../model/client"
import { FamilyInlinekeyboardAction, ViewFamilyMemberCallback } from "../models"
import { BuildFamilyInline } from "../buildFamilyInline"
import { BotUtils } from "../../singUp/functions"
import { FamilyQueries } from "../queries"
import { ViewFamilyInlineKeyboard } from "./viewFamiliesKeyboard"

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

export class FamilyInlineKeyboard extends MessageTemplate {
  constructor(private ctx: Context) { super() }
  protected prepareMessage() {
    const message = `📋 *Menú de Familias*: Estamos trabajando para implementarlo completamente. ¡Pronto estará disponible con todas sus funciones!`
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(`Visualizar familias`, { action: FamilyInlinekeyboardAction.viewFamily }),
          this.createButton(`Unirse a familia`, { action: FamilyInlinekeyboardAction.joinFamily })
        ],
        [
          this.createButton(`Crear familia`, { action: FamilyInlinekeyboardAction.createFamily })
        ]
      ]
    }
    return { message, keyboard }
  } async handleOptions(ctx: Context, __: Message, action: string, bot: Telegraf) {
    await deleteBotMessage(this.ctx)
    const handler: { [key: string]: () => Promise<void> } = {
      [FamilyInlinekeyboardAction.viewFamily]: this.handleViewFamilies.bind(this, bot),
      [FamilyInlinekeyboardAction.createFamily]: this.handleCreateFamily.bind(this, ctx, bot),
      [FamilyInlinekeyboardAction.joinFamily]: this.handleJoinFamily.bind(this, ctx, bot)
    }
    if (handler[action]) {
      return handler[action]()
    }
  }
  private async handleViewFamilies(bot: Telegraf) {
    const responseData = await FamilyQueries.getFamiliesById(this.ctx.from!.id)
    const response = new ViewFamilyInlineKeyboard("getMethod", responseData)
    return await setUpKeyboardIteration(this.ctx, response, bot, { callbackManualPattern: FamilyType.FAMILY })
  }
  private async handleJoinFamily(ctx: Context, bot: Telegraf) {
    await BotUtils.sendBotMessage(ctx,
      `👦 Por favor, ingresa el nombre de tu familia para continuar

_Ejemplo_:
\`\`\`
familiaNombre
\`\`\``)
    updateUserStage(ctx.from!.id, BotStage.PostFamily.JOIN_FAMILY_NAME)
  }
  private async handleCreateFamily(ctx: Context, bot: Telegraf) {
    await BotUtils.sendBotMessage(ctx,
      `👦 Por favor, ingresa el nombre de la familia para continuar

_Ejemplo_:
\`\`\`
familiaNombre
\`\`\``)
    updateUserStage(ctx.from!.id, BotStage.PostFamily.NAME)
  }
}



























