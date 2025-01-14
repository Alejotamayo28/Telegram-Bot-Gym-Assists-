// working on this ->
// dos opciones (ver perfil, editar perfil)
// cada cosa del perfil ha de ser editable (name, weight, height, etc...)

import { InlineKeyboardMarkup, Message } from "telegraf/typings/core/types/typegram";
import { MessageTemplate } from "../../../template/message";
import { Context, Telegraf } from "telegraf";
import { deleteBotMessage } from "../../../userState";
import { ClientQueries } from "./queries";
import { ClientDataMapped } from "./functions";
import { BotUtils } from "../singUp/functions";
import { botMessages } from "../../messages";
import { mainMenuPage } from "../../mainMenu";
import {  regexPattern, setUpKeyboardIteration } from "../utils";

export enum ClientProfileCallbacks {
  FETCH_PROFILE = 'FETCH_PROFILE',
  EDIT_PROFILE = 'EDIT_PROFILE'
}

export class ClientProfileInlineKeyboard extends MessageTemplate {
  prepareMessage() {
    const message = 'Hola, este el menu de tu perfil, aqui tendras varias opcions para interactuar:...'
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(`Ver perfil`, { action: ClientProfileCallbacks.FETCH_PROFILE }),
          this.createButton(`Editar perfil`, { action: ClientProfileCallbacks.EDIT_PROFILE })
        ]
      ]
    }
    return { message, keyboard }
  }
  async handleOptions(ctx: Context, message: Message, action: string, bot: Telegraf) {
    await deleteBotMessage(ctx)
    const handlers: { [key: string]: () => Promise<void> } = {
      [ClientProfileCallbacks.FETCH_PROFILE]: this.handleFetchProfile.bind(this, ctx, bot),
      [ClientProfileCallbacks.EDIT_PROFILE]: this.handleEditProfile.bind(this, ctx, bot)
    }
    if (handlers[action]) {
      return handlers[action]()
    }
  }
  private async handleFetchProfile(ctx: Context, bot: Telegraf): Promise<void> {
    console.log('hola')
    const response = await ClientQueries.handleProfileUser(ctx.from!.id)
    const data = ClientDataMapped.ClientInfo(response)
    await BotUtils.sendBotMessage(ctx, data)
    return await mainMenuPage(ctx, bot, botMessages.inputRequest.prompts.getMethod.succesfull)
  }
  private async handleEditProfile(ctx: Context, bot: Telegraf) {
    const response = new ClientProfileEditInlineKeyboard()
    return await setUpKeyboardIteration(ctx, response, bot,
      { callbackPattern: regexPattern(ClientEditProfileCallbacks) })
  }
}


export enum ClientEditProfileCallbacks {
  NICKNAME = 'NICKNAME',
  PASSWORD = 'PASSWORD',
  EMAIL = 'EMAIL',
  NAME = 'NAME',
  LAST_NAME = 'LAST_NAME',
  AGE = 'AGE',
  WEIGHT = 'WEIGHT',
  HEIGHT = 'HEIGHT'
}

type handlerFunction = (ctx: Context, message: Message, bot: Telegraf) => Promise<void>

type Handlers = {
  [key: string]: handlerFunction
}

export class ClientProfileEditInlineKeyboard extends MessageTemplate {
  prepareMessage() {
    const message = 'Escoge el atributo que te gustaria editar:...'
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton('Nickname', { action: ClientEditProfileCallbacks.NICKNAME }),
          this.createButton('Contrasena', { action: ClientEditProfileCallbacks.PASSWORD }),
          this.createButton('Email', { action: ClientEditProfileCallbacks.EMAIL })
        ],
        [
          this.createButton('Nombre', { action: ClientEditProfileCallbacks.NAME }),
          this.createButton('Apellido', { action: ClientEditProfileCallbacks.LAST_NAME }),
          this.createButton('Edad', { action: ClientEditProfileCallbacks.AGE })
        ],
        [
          this.createButton('Peso', { action: ClientEditProfileCallbacks.WEIGHT }),
          this.createButton('Altura', { action: ClientEditProfileCallbacks.HEIGHT })
        ]
      ]
    }
    return { message, keyboard }
  }
  private readonly handlers: Handlers = {
    [ClientEditProfileCallbacks.NICKNAME]: this.handleEditNickname.bind(this),
    [ClientEditProfileCallbacks.PASSWORD]: this.handleEditPassword.bind(this),
    [ClientEditProfileCallbacks.EMAIL]: this.handleEditEmail.bind(this),
    [ClientEditProfileCallbacks.NAME]: this.handleEditName.bind(this),
    [ClientEditProfileCallbacks.LAST_NAME]: this.handleEditLastName.bind(this),
    [ClientEditProfileCallbacks.AGE]: this.handleEditAge.bind(this),
    [ClientEditProfileCallbacks.WEIGHT]: this.handleEditWeight.bind(this),
    [ClientEditProfileCallbacks.HEIGHT]: this.handleEditHeight.bind(this)
  }
  async handleOptions(ctx: Context, message: Message, action: string, bot: Telegraf) {
    try {
      await deleteBotMessage(ctx)
      const handler = this.handlers[action]
      if (!handler) throw new Error(`Handler not implemented for action: ${action}`)
      return await handler(ctx, message, bot)
    } catch (error) {
      console.error(`Error handling action ${action}: `, action)
    }
  }
  async handleEditNickname(ctx: Context) {
    await ctx.reply(`Por favor digita tu nuevo nickname: `)
  }
  async handleEditPassword(ctx: Context) {
    await ctx.reply(`Por favor digita tu nueva contrasena: `)
  }
  async handleEditEmail(ctx: Context) {
    await ctx.reply(`Por favor digita tu nuevo email: `)
  }
  async handleEditName(ctx: Context) {
    await ctx.reply(`Por favor digita tu nuevo nombre: `)
  }
  async handleEditLastName(ctx: Context) {
    await ctx.reply(`Por favor digita tu nuevo apellido: `)
  }
  async handleEditAge(ctx: Context) {
    await ctx.reply(`Por favor digita tu nueva edad: `)
  }
  async handleEditWeight(ctx: Context) {
    await ctx.reply(`Por favor digita tu nuevo peso: `)
  }
  async handleEditHeight(ctx: Context) {
    await ctx.reply(`Por favor digita tu nueva altura: `)
  }
}


