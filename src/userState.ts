import { Context } from "telegraf"
export let userState: { [key: number]: any } = {}

export enum SignUpStage {
  NICKNAME = 'SIGN_UP_NICKNAME',
  PASSWORD = 'SIGN_UP_PASSWORD',
  EMAIL = 'SIGN_UP_EMAIL'
}

export function getUserState(userId: number) {
  return userState[userId]
}

export enum userStageCreateFamily {
  POST_FAMILY_NAME = 'postFamilyName',
  POST_FAMILY_PASSWORD = 'postFamilyPassword'
}

export enum userStage {
  LOGIN_NICKNAME = 'loginNicknameStage',
  LOGIN_PASSWORD = 'loginPasswordStage',
  LOGIN_EXAMPLE = 'loginExampleStage'
}

export enum userStageSignUp {
  SIGN_UP_NICKNAME = 'signUpNicknameStage',
  SIGN_UP_PASSWORD = 'signUpPasswordStage',
  SIGN_UP_EMAIL = 'signUpEmailStage',
  SIGN_UP_EXAMPLE = 'signUpExample'
}

export enum userStagePostExercise {
  POST_EXERCISE_DAY = 'postExerciseDay',
  POST_EXERCISE_NAME = 'postExerciseName',
  POST_EXERCISE_REPS = 'postExerciseReps',
  POST_EXERCISE_VERIFICATION = 'postExerciseVerification'
}

export enum userStagePutExercise {
  PUT_EXERCISE_DAY = 'putExerciseDay',
  PUT_EXERCISE_NAME = 'putExerciseName',
  PUT_EXERCISE_REPS = 'putExerciseReps',
  PUT_EXERCISE_WEIGHT = 'putExerciseWeight'
}

export enum userStageGetExercise {
  GET_EXERCISE_OPTIONS = 'getExerciseOptions',
  GET_EXERCISE_MONTH = 'getExerciseMonth',
  GET_EXERCISE_DAY = 'getExerciseDay',
  GET_EXERCISE_MONTH_STAGE = 'getExerciseMonthStage',
  GET_EXERCISE_RECORD = `getExerciseRecord`

}

export enum userStageDeleteExercise {
  DELETE_EXERCISE_MONTH = 'deleteExerciseMonth',
  DELETE_EXERCISE_DAY = 'deleteExerciseDay',
  DELETE_EXERCISE_NAME = 'deleteExerciseName',
  DELETE_EXERCISE_WEEK = 'deleteExerciseWeek',
  DELETE_CONFIRMATION = 'deleteConfirmation'
}

interface Initial {
  nickname?: string
  password?: string
}

export namespace BotStage {
  export enum Auth {
    NICKNAME = 'LOGIN_NICKAME',
    PASSWORD = 'LOGIN_PASSWORD'
  }
  export enum Register {
    NICKNAME = 'SIGN_UP_NICKNAME',
    PASSWORD = 'SIGN_UP_PASSWORD',
    EMAIL = 'SIGN_UP_EMAIL'
  }
  export enum Exercise {
    CREATE_NAME = 'EXERCISE_CREATE_NAME',
    CREATE_REPS = 'EXERCISE_CREATE_REPS',
    CREATE_WEIGHT = 'EXERCISE_CREATE_WEIGHT',
    UPDATE_REPS = 'EXERCISE_UPDATE_REPS',
    UPDATE_WEIGHT = 'EXERCISE_UPDATE_WEIGHT',
    GET_NAME = 'EXERCISE_GET_NAME'
  }
  export enum PostFamily {
    NAME = 'POST_FAMILY_NAME',
    PASSWORD = 'POST_FAMILY_PASSWORD'
  }
}

interface UserCredentials {
  nickname?: string,
  password?: string
  email?: string
}

interface UserProfile {
  name?: string,
  lastName?: string
}

export interface Exercise {
  month?: string
  day?: string,
  week?: number
  name?: string,
  reps?: number[]
  weight?: number
}

interface UserState {
  stage: BotStage.Auth | BotStage.Register | BotStage.Exercise | BotStage.PostFamily
  data: {
    credentials: Partial<UserCredentials>,
    profile: Partial<UserProfile>,
    exercise: Exercise
  }
}

type UserStateUpdate = Partial<{
  stage: UserState['stage'],
  data: Partial<UserState['data']>
}>

export function updateUserState(
  userId: number,
  updates: UserStateUpdate)
  : void {
  userState[userId] = {
    ...userState[userId],
    ...updates,
    data: {
      ...userState[userId]?.data,
      credentials: {
        ...userState[userId]?.data?.credentials,
        ...updates.data?.credentials
      },
      profile: {
        ...userState[userId]?.data?.profile,
        ...updates.data?.profile
      },
      exercise: {
        ...userState[userId]?.data?.exercise,
        ...updates.data?.exercise
      }
    }
  }
}

export function updateUserStage(
  userId: number,
  stage: UserState['stage']
): void {
  userState[userId] = {
    ...userState[userId],
    stage
  }
}

export function getUserCredentials(
  userId: number
): Required<UserCredentials> {
  return userState[userId].data.credentials
}

export function getUserExercise(
  userId: number
): Required<Exercise> {
  return userState[userId].data.exercise
}



export interface UpdateUserStateOptions {
  Login?: Initial
  month?: string,
  day?: string;
  name?: string;
  reps?: number[];
  kg?: number;
  week?: number,
  interval?: number,
  stage?: string;
  nickname?: string,
  password?: string,
  email?: string,
  exercisesId?: number[],
  messagesId?: number[],
  selectionDone?: boolean,
  familyId?: number,
  familyName?: string,
  familyPassword?: string,
  familyMemberId?: number,
  familyMemberNickname?: string
}

export const botMessageTest: { [userId: number]: number } = {}
export const userMessageTest: { [userId: number]: number } = {}

export const saveBotMessage = async (ctx: Context, messageId: number) => {
  botMessageTest[ctx.from!.id] = messageId
}
export const saveUserMessage = async (ctx: Context) => {
  userMessageTest[ctx.from!.id] = ctx.message!.message_id
}
export const deleteBotMessage = async (ctx: Context) => {
  if (botMessageTest[ctx.from!.id]) {
    const messageId = botMessageTest[ctx.from!.id]
    await ctx.deleteMessage(messageId)
    console.log(`Bot message with the id: ${messageId} deleted`)
    delete botMessageTest[ctx.from!.id]

  }
}
export const deleteUserMessage = async (ctx: Context) => {
  if (userMessageTest[ctx.from!.id]) {
    await ctx.deleteMessage(userMessageTest[ctx.from!.id])
    console.log(`User message with the id: ${userMessageTest[ctx.from!.id]} deleted`)
    delete userMessageTest[ctx.from!.id]
  }
}

export const updateUserStateExample = (ctx: Context, updates: UpdateUserStateOptions) => {
  userState[ctx.from!.id] = {
    ...userState[ctx.from!.id],
    ...updates
  }
}
export const userStateUpdataFamilyMemberNickname = (ctx: Context, familyMemberNickname: string) => {
  updateUserStateExample(ctx, { familyMemberNickname })
}

export const userStateUpdateFamilyMemberId = (ctx: Context, familyMemberId: number) => {
  updateUserStateExample(ctx, { familyMemberId })
}

export const userStateUpdateFamilyId = (ctx: Context, familyId: number) => {
  updateUserStateExample(ctx, { familyId })
}

export const userStateUpdateFamilyName = (ctx: Context, familyName: string) => {
  updateUserStateExample(ctx, { familyName })
}

export const userStateUpdateFamilyPassword = (ctx: Context, familyPassword: string) => {
  updateUserStateExample(ctx, { familyPassword })
}


export const userStateUpdateSelectionDone = (ctx: Context, selectionDone: boolean) => {
  updateUserStateExample(ctx, { selectionDone })
}
export const userStateUpdateMessagesId = (ctx: Context, messagesId: number[]) => {
  updateUserStateExample(ctx, { messagesId })
}

export const userStateUpdateExercisesId = (ctx: Context, exercisesId: number[]) => {
  updateUserStateExample(ctx, { exercisesId })
}

export const userStateUpdateStage = (ctx: Context, stage: string) => {
  updateUserStateExample(ctx, { stage })
}

export const userStateUpdateDay = (ctx: Context, day: string, stage?: string) => {
  updateUserStateExample(ctx, { day, stage })
}

export const userStateUpdateMonth = (ctx: Context, month: string, stage?: string) => {
  updateUserStateExample(ctx, { month, stage })
}

export const userStateUpdateName = (ctx: Context, name: string, stage?: string) => {
  updateUserStateExample(ctx, { name, stage })
}

export const userStateUpdateReps = (ctx: Context, reps: number[], stage?: string) => {
  updateUserStateExample(ctx, { reps, stage })
}

export const userStateUpdateKg = (ctx: Context, kg: number, stage?: string) => {
  updateUserStateExample(ctx, { kg, stage })
}


export const userStateUpdateWeek = (ctx: Context, week: number, stage?: string) => {
  updateUserStateExample(ctx, { week, stage })
}

export const userStateUpdateNickname = (ctx: Context, nickname: string, stage?: string) => {
  updateUserStateExample(ctx, { nickname, stage })
}

export const userStateUpdatePassword = (ctx: Context, password: string, stage?: string) => {
  updateUserStateExample(ctx, { password, stage })
}

export const userStateUpdateEmail = (ctx: Context, email: string, stage?: string) => {
  updateUserStateExample(ctx, { email, stage })
}

export const userStateUpdateInterval = (ctx: Context, interval: number, stage?: string) => {
  updateUserStateExample(ctx, { interval, stage })
}
