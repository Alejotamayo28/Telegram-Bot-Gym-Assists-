import { PoolClient, QueryResult } from "pg"
import { getWorkoutAllDataQuery } from "../queries/workoutQueries"

export const menuPageGetExercises = async (client: PoolClient, id: any) => {
  let lunes = 'Lunes: \n'
  let martes = 'Martes:  \n'
  let miercoles = 'Miercoles: \n'
  let jueves = 'Jueves: \n'
  let viernes = 'Viernes: \n'
  let sabado = 'Sabado: \n'
  let domingo = 'Domingo: \n'

  const response: QueryResult = await getWorkoutAllDataQuery(client, id)

  response.rows.map(row => {
    if (row.day === 'lunes') {
      lunes += `${row.name}, repeticiones: {${row.reps}}, peso: ${row.kg}.\n`
    } else if (row.day === 'martes') {
      martes += `${row.name}, repeticiones: {${row.reps}}, peso: ${row.kg}.\n`
    } else if (row.day === 'miercoles') {
      miercoles += `${row.name}, repeticiones: {${row.reps}}, peso: ${row.kg}.\n`
    } else if (row.day === 'jueves') {
      jueves += `${row.name}, repeticiones: {${row.reps}}, peso: ${row.kg}.\n`
    } else if (row.day === 'viernes') {
      viernes += `${row.name}, repeticiones: {${row.reps}}, peso: ${row.kg}.\n`
    } else if (row.day === 'sabado') {
      sabado += `${row.name}, repeticiones: {${row.reps}}, peso: ${row.kg}.\n`
    } else if (row.day === 'domingo') {
      domingo += `${row.name}, repeticiones: {${row.reps}}, peso: ${row.kg}.\n`
    }
  }).join('\n')
  return lunes + '\n' + martes + '\n' + miercoles + '\n' + jueves + '\n' + viernes + '\n' + sabado + '\n' + domingo + '\n'
}


