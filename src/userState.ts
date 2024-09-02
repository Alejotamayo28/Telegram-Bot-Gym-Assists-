import { UserSession } from "./bot/functions"
import { UserData } from "./model/client"
import { ClientWorkout } from "./model/workout"


export let userState: { [key: number]: any } = {}

export const userSession = new UserSession()

export interface User {
  data: UserData,
  stage: string,
  lastMessageId: number,
  workout: ClientWorkout
}

interface UserState {
  [key: number]: User
}
export let userState1: UserState = {}

export function initializeUserState(userId: number): void {
  userState1[userId] = {
    data: { email: '', nickname: '', password: '' },
    stage: '',
    lastMessageId: 0,
    workout: { day: '', name: '', series: 0, reps: [], kg: 0, nickname: '' }
  };
}

export function updateUserState(userId: number, newState: Partial<User>): void {
  if (!userState1[userId]) {
    initializeUserState(userId);
  }
  userState1[userId] = { ...userState[userId], ...newState }
}
