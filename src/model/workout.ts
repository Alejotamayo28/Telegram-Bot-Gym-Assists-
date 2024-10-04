enum weekday {
  Lunes = "lunes",
  Martes = "martes",
  Miercoles = "miercoles",
  Jueves = "jueves",
  Viernes = "viernes",
  Sabado = "sabado",
  Domingo = "domingo"
}


export interface ClientWorkout {
  day: string,
  name: string,
  reps: number[],
  kg: number | string
}

export type workoutOutput = Partial<ClientWorkout>
