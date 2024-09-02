export interface ClientWorkout {
  day: string,
  name: string,
  reps: number[],
  kg: number | string
}

export type workoutOutput = Partial<ClientWorkout>
export type userStateWorkout = Partial<ClientWorkout>

