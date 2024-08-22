import { UserSession } from "./bot/functions"
import { UserData } from "./model/client"
import { ClientWorkout } from "./model/workout"

export let userState: { [key: number]: any, data: UserData, stage: string, startMessage: number, workout: ClientWorkout } = {
  data: {
    email: '',
    nickname: '',
    password: ''
  },
  startMessage: 0,
  stage: '',
  workout: {
    day: '',
    name: '',
    series: 0,
    reps: [],
    kg: 0,
    nickname: ""
  }
}

export const userSession = new UserSession()
