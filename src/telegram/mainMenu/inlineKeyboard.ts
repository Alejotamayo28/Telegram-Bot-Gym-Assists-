import { Context, Telegraf } from 'telegraf';
import { InlineKeyboardMarkup, Message } from 'telegraf/typings/core/types/typegram';
import { botMessages } from '../messages';
import { MessageTemplate } from '../../template/message';
import { MainMenuCallbacks, MainMenuLabels, ReturnMainMenuCallbacks } from './models';
import { deleteBotMessage, saveBotMessage, userStageCreateFamily, userStageDeleteExercise, userStagePostExercise, userStagePutExercise, userState, userStateUpdateFamilyId, userStateUpdateFamilyMemberId, userStateUpdateName, userStateUpdateStage } from '../../userState';
import { fetchExerciseController } from '../services/getMethod';
import { ExerciseGetHandler } from '../services/getMethod/functions';
import { BotUtils } from '../services/singUp/functions';
import { exerciseDeletionFlow } from '../services/deleteMethod';
import { exercisePostFlow } from '../services/addMethod';
import { onSession } from '../../database/dataAccessLayer';
import { ClientCredentialsAndFamily, ClientInfo } from '../../model/client';
import { mainMenuPage } from '.';
import { buildFamilyInlineKeyboard, exercisesMethod, familiesMethod, groupedFamilyButtons, handleKeyboardStep, regexPattern, tryCatch } from '../services/utils';
import { familyInterface } from '../../model/family';

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
    deleteBotMessage(ctx)
    const handlers: { [key: string]: () => Promise<void> } = {
      [MainMenuCallbacks.postExercise]: this.handlePostExercise.bind(this, ctx, bot),
      [MainMenuCallbacks.getExercise]: this.handleGetExercise.bind(this, ctx, bot),
      [MainMenuCallbacks.getExerciseHistory]: this.handleGetExerciseWeek.bind(this, ctx, bot),
      [MainMenuCallbacks.updateExercise]: this.handleUpdateExercise.bind(this, ctx),
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
  private async handleUpdateExercise(ctx: Context): Promise<void> {
    await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.prompts.updateMethod.exerciseDay)
    userStateUpdateStage(ctx, userStagePutExercise.PUT_EXERCISE_DAY)
  }
  private async handleDeleteExercise(ctx: Context, bot: Telegraf): Promise<void> {
    await exerciseDeletionFlow(ctx, bot)
  }
  private async handleRoutine(ctx: Context, bot: Telegraf): Promise<void> {
    console.log(`not implemented yet`)
  }
  private static mappedClientInfo(data: ClientInfo): string {
    let result = `
🏋️ *Tu información personal* 

🔒 _Credenciales_:
   👤 Nickname: ${data.nickname}
   🔑 Contraseña (encriptada): ${data.password}
   📧 Correo: ${data.email}

📋 _Datos personales_:
   👤 Nombre: ${data.name} ${data.lastname}
   🎂 Edad: ${data.age} años
   ⚖️ Peso: ${data.weight} kg
   📏 Altura: ${data.height} m
`;
    return result
  }
  private async handleProfileUser(ctx: Context, bot: Telegraf) {
    const response = await onSession(async (clientTransaction): Promise<ClientInfo> => {
      const response = await clientTransaction.query(`
 select 
   c.nickname,
   c.password,
   c.email,
   ci.name,
   ci.lastname,
   ci.age,
   ci.weight,
   ci.height
   from 
   client c
   join
   clientinfo ci on c.id = ci.id 
where c.id = $1`, [ctx.from!.id])
      return response.rows[0]
    })
    const data = MainMenuHandler.mappedClientInfo(response)
    await BotUtils.sendBotMessage(ctx, data)
    return await mainMenuPage(ctx, bot, botMessages.inputRequest.prompts.getMethod.succesfull)
  }
  private async handleUserFamily(ctx: Context, bot: Telegraf) {
    return await familyInlinekeyboardController(ctx, bot)
  }
}

export const familyInlinekeyboardController = async (ctx: Context, bot: Telegraf) => {
  const response = new FamilyInlineKeyboard()
  try {
    const message = await response.sendCompleteMessage(ctx)
    await saveBotMessage(ctx, message.message_id)
    bot.action(regexPattern(FamilyInlinekeyboardAction), async (ctx) => {
      const action = ctx.match[0]
      await tryCatch(() => response.handleOptions(ctx, message, action, bot), ctx)
    })
  } catch (error) {
    console.error(`Error: `, error)

  }
}

export enum FamilyInlinekeyboardAction {
  viewFamily = `viewFamily`,
  createFamily = `createFamily`
}

export class FamilyInlineKeyboard extends MessageTemplate {
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
  } async handleOptions(ctx: Context, _: Message, action: string, bot: Telegraf) {
    await deleteBotMessage(ctx)
    const handler: { [key: string]: () => Promise<void> } = {
      [FamilyInlinekeyboardAction.viewFamily]: this.handleViewFamilies.bind(this, ctx, bot),
      [FamilyInlinekeyboardAction.createFamily]: this.handleCreateFamily.bind(this, ctx, bot)
    }
    if (handler[action]) {
      return handler[action]()
    }
  }
  private async handleViewFamilies(ctx: Context, bot: Telegraf) {
    // Flow: Families -> Families users -> userProfile
    const familiesView = await onSession(async (clientTransaction) => {
      const response = await clientTransaction.query(
        `SELECT
    f.id,
    f.name
FROM 
    family f
JOIN 
    client c 
ON 
    c.id = f.user_1
WHERE 
    c.id = $1;
        `, [ctx.from!.id])
      return response.rows
    })
    const familiesKeyboard = new ViewFamilyInlineKeyboard("getMethod", familiesView)


    await handleKeyboardStep(ctx, familiesKeyboard, bot)
  }
  private async handleCreateFamily(ctx: Context, bot: Telegraf) {
    const message = await ctx.reply(`digita el nombre de tu familia...:`)
    saveBotMessage(ctx, message.message_id)
    userStateUpdateStage(ctx, userStageCreateFamily.POST_FAMILY_NAME)
  }
}

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
    const handlers: { [key: string]: () => Promise<any> } = {}
    this.data.forEach(family => {
      handlers[family.id] = async () => {
        userStateUpdateFamilyId(ctx, family.id)
        await deleteBotMessage(ctx)
        return this.options[this.method](ctx, bot)
      }
    })
    if (handlers[action]) {
      return await handlers[action]()
    }
  }
  private options: { [key in keyof typeof familiesMethod]: (ctx: Context, bot: Telegraf) => Promise<void> } = {
    getMethod: async (ctx: Context, bot: Telegraf): Promise<void> => {
      const familieViewMember = await onSession(async (clientTransaction) => {
        const { familyId } = userState[ctx.from!.id]
        console.log(`estos son los integrantes de la familia`)
        const response = await clientTransaction.query(
          `SELECT 
    c.nickname,
    c.id
FROM 
    family f
JOIN 
    client c
ON 
    c.id IN (f.user_1, f.user_2, f.user_3, f.user_4, f.user_5)
WHERE 
    f.id = $1;`, [familyId])
        return response.rows
      })
      const response = new ViewFamilyMembersInlineKeybaord("getMethod", familieViewMember)
      await handleKeyboardStep(ctx, response, bot)
    }
  }
}

export class ViewFamilyMembersInlineKeybaord extends MessageTemplate {
  private selectedOption!: (ctx: Context, bot: Telegraf) => Promise<void>
  constructor(private method: keyof typeof familiesMethod, private data: ClientCredentialsAndFamily[]) {
    super()
    this.selectedOption = this.options[this.method]
  }
  protected prepareMessage() {
    const grouppedButtons = buildFamilyInlineKeyboard(this.data)
    const message = `estos son los integrantes de la familia:...`
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: grouppedButtons
    }
    return { message, keyboard }
  }
  async handleOptions(ctx: Context, message: Message, action: string, bot: Telegraf): Promise<void> {
    const handlers: { [key: string]: () => Promise<any> } = {}
    this.data.forEach((family: ClientCredentialsAndFamily) => {
      handlers[family.id] = async () => {
        await ctx.reply(`Has seleccionado al integrante: ${family.nickname}`)
        userStateUpdateFamilyMemberId(ctx, family.id)
        await deleteBotMessage(ctx)
        return this.options[this.method](ctx, bot)
      }
    })
    if (handlers[action]) {
      return await handlers[action]()
    }
  }
  private options: { [key in keyof typeof familiesMethod]: (ctx: Context, bot: Telegraf) => Promise<void> } = {
    getMethod: async (ctx: Context, bot: Telegraf): Promise<void> => {
      const familieViewMember = await onSession(async (clientTransaction) => {
        const { familyId } = userState[ctx.from!.id]
        const response = await clientTransaction.query(
          `SELECT 
    c.nickname,
    c.id
FROM 
    family f
JOIN 
    client c
ON 
    c.id IN (f.user_1, f.user_2, f.user_3, f.user_4, f.user_5)
WHERE 
    f.id = $1;`, [familyId])
        return response.rows
      })
      console.log(familieViewMember)
    }
  }
}

// Flow: ask (create, view) => view families OR create family 




//working file <----


export class MainMenuHandlerWithTaskDone extends MessageTemplate {
  protected prepareMessage() {
    const message = this.taskDone!
    const keyboard: InlineKeyboardMarkup = {
      inline_keyboard: [
        [
          this.createButton(MainMenuLabels.postExercise, { action: ReturnMainMenuCallbacks.returnpostExercise }),
          this.createButton(MainMenuLabels.getExercise, { action: ReturnMainMenuCallbacks.returngetExercise }),
        ],
        [
          this.createButton(MainMenuLabels.updateExercise, { action: ReturnMainMenuCallbacks.returnupdateExercise }),
          this.createButton(MainMenuLabels.deleteExercise, { action: ReturnMainMenuCallbacks.returndeleteExercise })
        ],
        [
          this.createButton(MainMenuLabels.getExerciseHistory, { action: ReturnMainMenuCallbacks.returngetExerciseHistory })
        ]
      ]
    }
    return { message, keyboard }
  }
  async handleOptions(ctx: Context, _: Message, action: string, bot: Telegraf) {
    try {
      deleteBotMessage(ctx)
      const handlers: { [key: string]: () => Promise<void> } = {
        [ReturnMainMenuCallbacks.returnpostExercise]: this.handlePostExercise.bind(this, ctx),
        [ReturnMainMenuCallbacks.returngetExercise]: this.handleGetExercise.bind(this, ctx, bot),
        [ReturnMainMenuCallbacks.returngetExerciseHistory]: this.handleGetExerciseWeek.bind(this, ctx, bot),
        [ReturnMainMenuCallbacks.returnupdateExercise]: this.handleUpdateExercise.bind(this, ctx),
        [ReturnMainMenuCallbacks.returndeleteExercise]: this.handleDeleteExercise.bind(this, ctx)
      }
      if (handlers[action]) {
        return handlers[action]()
      }
    } catch (error) {
      console.error(`Error MainMenuHandlerWithTaskDone: `, error)
    }
  }
  private async handleGetExercise(ctx: Context, bot: Telegraf) {
    return await fetchExerciseController(ctx, bot)
  }
  private async handleGetExerciseWeek(ctx: Context, bot: Telegraf) {
    await ExerciseGetHandler.getAllTimeExerciseText(ctx, bot)
  }
  private async handlePostExercise(ctx: Context) {
    await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.prompts.postMethod.exerciseDay)
    userStateUpdateStage(ctx, userStagePostExercise.POST_EXERCISE_DAY)
  }
  private async handleUpdateExercise(ctx: Context) {
    await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.prompts.updateMethod.exerciseDay)
    userStateUpdateStage(ctx, userStagePutExercise.PUT_EXERCISE_DAY)
  }
  private async handleDeleteExercise(ctx: Context) {
    await BotUtils.sendBotMessage(ctx, botMessages.inputRequest.prompts.deleteMethod.exerciseDay)
    userStateUpdateStage(ctx, userStageDeleteExercise.DELETE_EXERCISE_DAY)
  }
}
