import { PoolClient, QueryResult } from "pg"
import { getWorkoutAllDataQuery } from "../queries/workoutQueries"

export const menuPageGetExercises = async (client: PoolClient, id: any) => {
  let lunes = '_Lunes_: \n'
  let martes = '_Martes_:  \n'
  let miercoles = '_Miercoles_: \n'
  let jueves = '_Jueves_: \n'
  let viernes = '_Viernes_: \n'
  let sabado = '_Sabado_: \n'
  let domingo = '_Domingo_: \n'

  const response: QueryResult = await getWorkoutAllDataQuery(client, id)

  response.rows.map(row => {
    if (row.day === 'lunes') {
      lunes += `- Nombre: ${row.name}, series: ${row.series}, repeticiones: {${row.reps}}, peso: ${row.kg}.\n`
    } else if (row.day === 'martes') {
      martes += `- Nombre: ${row.name}, series: ${row.series}, repeticiones: {${row.reps}}, peso: ${row.kg}.\n`
    } else if (row.day === 'miercoles') {
      miercoles += `- Nombre: ${row.name}, series: ${row.series}, repeticiones: {${row.reps}}, peso: ${row.kg}.\n`
    } else if (row.day === 'jueves') {
      jueves += `- Nombre: ${row.name}, series: ${row.series}, repeticiones: {${row.reps}}, peso: ${row.kg}.\n`
    } else if (row.day === 'viernes') {
      viernes += `- Nombre: ${row.name}, series: ${row.series}, repeticiones: {${row.reps}}, peso: ${row.kg}.\n`
    } else if (row.day === 'sabado') {
      sabado += `- Nombre: ${row.name}, series: ${row.series}, repeticiones: {${row.reps}}, peso: ${row.kg}.\n`
    } else if (row.day === 'domingo') {
      domingo += `- Nombre: ${row.name}, series: ${row.series}, repeticiones: {${row.reps}}, peso: ${row.kg}.\n`
    }
  }).join('\n')
  return lunes + '\n' + martes + '\n' + miercoles + '\n' + jueves + '\n' + viernes + '\n' + sabado + '\n' + domingo + '\n' + `Escribe *menu* para volver a tu menu de usuario.`
}


