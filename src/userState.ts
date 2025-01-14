import { Context } from "telegraf"
import { Client } from "pg"

export let userState: { [key: number]: any } = {}

export function getUserState(userId: number) {
  return userState[userId]
}

export enum userStageCreateFamily {
  POST_FAMILY_NAME = 'postFamilyName',
  POST_FAMILY_PASSWORD = 'postFamilyPassword'
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
    GET_NAME = 'EXERCISE_GET_NAME',
    GET_ONE_EXERCISE_RECORD = 'EXERCISE_ONE_RECORD'
  }
  export enum PostFamily {
    NAME = 'POST_FAMILY_NAME',
    PASSWORD = 'POST_FAMILY_PASSWORD',
    JOIN_FAMILY_NAME = 'JOIN_FAMILY_NAME',
    JOIN_FAMILY_PASSWORD = 'JOIN_FAMILY_PASSWORD'
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
  id: number
  date: Date
  year: number
  month: string
  day: string,
  week: number
  name: string,
  reps: number[]
  weight: number,
}

export interface UpdateExercise {
  weight?: number,
  reps?: number[]
}

export interface Message {
  messageId?: number[]
}
export interface SelectedExercises {
  exercisesId?: number[]
}

export type FamilyRole = 'ADMIN' | 'MEMBER'


export interface Family {
  family_id: number,
  family_name: string,
  family_password: string,
  created_at: Date,
  max_members: number,
  description: string,
  members?: FamilyMember[]
}

export interface FamilyMember {
  family_member_id: number,
  family_id: number,
  client_id: number,
  role: FamilyRole,
  joined_at: Date,
  user?: Client
}

export interface UserFamilyResponse {
  id: number,
  nickname: string,
  family_id: number,
  family_name: string,
  role: FamilyRole,
  joined_at: Date
}

export interface UserFamilyMemberResponse {
  id: number,
  nickname: string
}


interface UserState {
  stage: BotStage.Auth | BotStage.Register | BotStage.Exercise | BotStage.PostFamily
  data: {
    credentials: Partial<UserCredentials>,
    profile: Partial<UserProfile>,
    exercise: Partial<Exercise>,
    updateExercise: Partial<UpdateExercise>,
    message: Partial<Message>,
    selectedExercises: Partial<SelectedExercises>,
    family: Partial<Family>,
    familyMember: Partial<FamilyMember>,
    selectedFamilyMember: Partial<UserFamilyMemberResponse>
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
      },
      updateExercise: {
        ...userState[userId]?.data?.updateExercise,
        ...updates.data?.updateExercise
      },
      message: {
        ...userState[userId]?.data?.message,
        ...updates.data?.message
      },
      selectedExercises: {
        ...userState[userId]?.data?.selectedExercises,
        ...updates.data?.selectedExercises
      },
      family: {
        ...userState[userId]?.data?.family,
        ...updates.data?.family
      },
      familyMember: {
        ...userState[userId]?.data?.familyMember,
        ...updates.data?.familyMember
      },
      selectedFamilyMember: {
        ...userState[userId]?.data?.selectedFamilyMember,
        ...updates.data?.selectedFamilyMember
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

export function getUserFamily(
  userId: number
): Required<Family> {
  return userState[userId].data.family
}

export function getFamilyMember(
  userId: number
): Required<FamilyMember> {
  return userState[userId].data.familyMember
}

export function getUserUpdateExercise(
  userId: number
): Required<UpdateExercise> {
  return userState[userId].data.updateExercise
}

export function getUserSelectedMessagesId
  (userId: number
  ): Required<Message> {
  return userState[userId].data.message
}

export function getUserSelectedExercisesId
  (userId: number
  ): Required<SelectedExercises> {
  return userState[userId].data.selectedExercises
}

export function getUserSelectedMember(
  userId: number
): Required<UserFamilyMemberResponse> {
  return userState[userId].data.selectedFamilyMember
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




