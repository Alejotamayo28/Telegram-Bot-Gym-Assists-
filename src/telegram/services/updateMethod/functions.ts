import { Exercise } from "../../../userState"
import { QueryResult } from "pg"
import { onSession } from "../../../database/dataAccessLayer"

export const findExerciseByDayName = async (userId: number, userState: Exercise):
  Promise<QueryResult<Exercise>> => {
  const { day, name }: Exercise = userState
  const response: QueryResult<Exercise> = await onSession(async (clientTransaction) => {
    const { rows, rowCount }: QueryResult = await clientTransaction.query(`
    SELECT name, reps, weight FROM workout WHERE user_id = $1 AND day = $2 AND name = $3`,
      [userId, day, name])
    return rowCount ? rows[0] : null
  })
  return response
}


