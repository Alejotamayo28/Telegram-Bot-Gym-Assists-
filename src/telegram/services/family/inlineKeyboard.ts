import { Context, Telegraf } from "telegraf"
import { MessageTemplate } from "../../../template/message"
import { familiesMethod, FamilyType, regexPattern, setUpKeyboardIteration } from "../utils"
import { familyInterface } from "../../../model/family"
import { InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram"
import { deleteBotMessage, saveBotMessage, userStageCreateFamily, userState, userStateUpdataFamilyMemberNickname, userStateUpdateFamilyId, userStateUpdateFamilyMemberId, userStateUpdateStage } from "../../../userState"
import { ClientCredentialsAndFamily } from "../../../model/client"
import { FamilyInlinekeyboardAction, ViewFamilyMemberCallback } from "./models"
import { BuildFamilyInline } from "./buildFamilyInline"
import { familiesDataQuery, familiesMembersDataQuery } from "."

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
    const responseData = await familiesDataQuery(this.ctx)
    const response = new ViewFamilyInlineKeyboard("getMethod", responseData)
    return await setUpKeyboardIteration(this.ctx, response, bot, { callbackManualPattern: FamilyType.FAMILY })
  }
  private async handleCreateFamily(bot: Telegraf) {
    const message = await this.ctx.reply(`digita el nombre de tu familia...:`)
    saveBotMessage(this.ctx, message.message_id)
    return userStateUpdateStage(this.ctx, userStageCreateFamily.POST_FAMILY_NAME)
  }
}

export class ViewFamilyInlineKeyboard extends MessageTemplate {
  private selectedOption!: (ctx: Context, bot: Telegraf) => Promise<void>
  constructor(private method: keyof typeof familiesMethod, private data: familyInterface[]) {
    super()
    this.selectedOption = this.options[this.method]
  }
  protected prepareMessage() {
    const grouppedButtons = BuildFamilyInline.createInlineKeyboard("viewFamilies", this.data)
    const message = `👪 _Estas son las familias a las que perteneces_.\n\nSelecciona una para ver más detalles o gestionar sus miembros.`
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
      await deleteBotMessage(ctx)
      const responseData = await familiesMembersDataQuery(ctx)
      const response = new ViewFamilyMembersInlineKeybaordNotWorking("getMethod", responseData)
      return await setUpKeyboardIteration(ctx, response, bot, { callbackManualPattern: FamilyType.MEMBER })
    }
  }
}

export class ViewFamilyMembersInlineKeybaordNotWorking extends MessageTemplate {
  private selectedOption!: (ctx: Context, bot: Telegraf) => Promise<void>
  constructor(private method: keyof typeof familiesMethod, private data: ClientCredentialsAndFamily[]) {
    super()
    this.selectedOption = this.options[this.method]
  }
  protected prepareMessage() {
    const grouppedButtons = BuildFamilyInline.createInlineKeyboard("viewFamiliesMember", this.data)
    const message = `👤 _Estos son los integrantes de tu familia_.\n\nSelecciona a alguien para gestionar o ver más detalles`
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: grouppedButtons
    }
    return { message, keyboard }
  }
  public async handleOptions(ctx: Context, message: Message, action: string, bot: Telegraf): Promise<void> {
    const handlers: { [key: string]: () => Promise<void> } = {}
    this.data.forEach(family => {
      handlers[`member_${family.nickname}`] = async () => {
        return this.options[this.method](ctx, bot, family)
      }
    })
    if (handlers[action]) {
      return await handlers[action]()
    }
  }
  private options: { [key in keyof typeof familiesMethod]: (ctx: Context, bot: Telegraf, data?: ClientCredentialsAndFamily) => Promise<void> } = {
    getMethod: async (ctx: Context, bot: Telegraf, data?: ClientCredentialsAndFamily): Promise<void> => {
      userStateUpdateFamilyMemberId(ctx, data!.id)
      userStateUpdataFamilyMemberNickname(ctx, data!.nickname)
      const viewFamilyMemberData = new ViewFamilyMemberDataInlineKeyboard(ctx)
      return await setUpKeyboardIteration(ctx, viewFamilyMemberData, bot, { callbackPattern: regexPattern(ViewFamilyMemberCallback) })
    }
  }
}

//Menu de iteraccion con otro usuario -> (Perfil)(Historial Ejercicios)(Ejercicios Semana Pasada)
export class ViewFamilyMemberDataInlineKeyboard extends MessageTemplate {
  constructor(private ctx: Context) {
    super()
  }
  protected prepareMessage() {
    const { familyMemberNickname } = userState[this.ctx.from!.id]
    const message = `📂 _Estás viendo el perfil de: ${familyMemberNickname.toUpperCase()}_.\n\n¿Qué te gustaría hacer a continuación?`
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(`Historial Ejercicios`, { action: ViewFamilyMemberCallback.HistorialEjercicios }),
          this.createButton(`Ejercicios Semana Pasada`, { action: ViewFamilyMemberCallback.EjerciciosSemanaPasada })
        ],
        [
          this.createButton(`Perfil`, { action: ViewFamilyMemberCallback.Perfil })
        ]
      ]
    }
    return { message, keyboard }
  }
  async handleOptions(_: Context, message: Message, action: string) {
    const handlers: { [key: string]: () => Promise<void> } = {
      [ViewFamilyMemberCallback.HistorialEjercicios]: this.handleExeriseHistory.bind(this),
      [ViewFamilyMemberCallback.EjerciciosSemanaPasada]: this.handleExerciseLastWeek.bind(this),
      [ViewFamilyMemberCallback.Perfil]: this.handleClientPerfil.bind(this)
    }
    if (handlers[action]) {
      return await handlers[action]()
    }
  }
  private async handleExeriseHistory() {
    await this.ctx.reply(`handleExerciseHistory on development`)
  }
  private async handleExerciseLastWeek() {
    await this.ctx.reply(`handleExerciseLastWeek on development`)
  }
  private async handleClientPerfil() {
    await this.ctx.reply(`handleClientPerfil on development`)
  }
}


















