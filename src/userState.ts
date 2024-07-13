import { UserSession } from "./bot/funtions"
import { UserData } from "./model/interface/client"
import { ClientWorkout } from "./model/interface/workout"

export let userState: { [key: number]: any, data: UserData, stage: string, workout: ClientWorkout } = {
    data: {
        email: '',
        nickname: '',
        password: ''
    },
    stage: '',
    workout: {
        day: '',
        name: '',
        series: 0,
        reps: [],
        kg: 0
    }
}

export const userSession = new UserSession()