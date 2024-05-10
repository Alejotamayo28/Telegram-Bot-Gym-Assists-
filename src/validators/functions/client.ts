import { clientGender } from '../enums/client'

export const verifyAge = (age: number): boolean => {
    if (age < 8 || age > 100) {
        throw new Error('Age out of range (8-100)')
    }
    return true
}

export const verifyGender = (gender: string): boolean => {
    if (Object.values(clientGender).includes(gender as clientGender)) { return true }
    throw new Error('Type your gender (Male/Female/Other)')
}
