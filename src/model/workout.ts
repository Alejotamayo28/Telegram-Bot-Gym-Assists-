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
  month: string,
  day: weekday,
  name: string,
  reps: number[],
  kg: number,
  week: number,
  interval: number
}

export interface Exercise {
  id:number,
  user_id: number,
  date: Date,
  month: string,
  day: weekday,
  name: string,
  reps: number[],
  kg: number,
  week: number,
  interval: number,
  year: number
}

export type PartialWorkout = Partial<userWorkout>
