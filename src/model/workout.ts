export interface ClientWorkout {
  id?: number,
  nickname: string,
  day: string,
  name: string,
  series: number,
  reps: number[],
  kg: number
}

type getClientWorkout = ClientWorkout
type crateClientWorkout = ClientWorkout
type updateClientWorkout = Partial<ClientWorkout>
type deleteClientWorkout = Pick<ClientWorkout, "id">

export type workoutOutput = Partial<ClientWorkout>

