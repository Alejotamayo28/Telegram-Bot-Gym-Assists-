enum weekday {
  Lunes = "lunes",
  Martes = "martes",
  Miercoles = "miercoles",
  Jueves = "jueves",
  Viernes = "viernes",
  Sabado = "sabado",
  Domingo = "domingo"
}

export interface userWorkout {
  day: weekday,
  name: string,
  reps: number[],
  kg: number
}

export type PartialWorkout = Partial<userWorkout>
