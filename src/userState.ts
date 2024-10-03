import { UserSession } from "./bot/functions"
import { userStateData } from "./model/client"
import { ClientWorkout, workoutOutput } from "./model/workout"
import { merge } from 'lodash'
export let userState: { [key: number]: any } = {}
export const userSession = new UserSession()
export interface User {
  data: userStateData,
  stage: string,
  lastMessageId: number,
  workout: ClientWorkout
}
export function updateUserState(userId: number, newState: Partial<User>): void {
  userState[userId] = { ...userState[userId], ...newState }
}
export class UserStateManager<T> {
  constructor(private userId: number) { }
  updateData(newData: T, nextStage?: string) {
    userState[this.userId].data = merge({}, userState[this.userId].data, newData);
    if (nextStage) {
      userState[this.userId].stage = nextStage
    }
  }
  getUserData() {
    return userState[this.userId].data
  }
  getStage() {
    return userState[this.userId].stage
  }
}
