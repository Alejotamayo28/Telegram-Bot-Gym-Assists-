export const INSERT_WORKOUT_QUERY = `
INSERT INTO workout (id, day, name, series, reps, kg) VALUES ($1, $2, $3, $4, $5, $6)`

export const GET_WORKOUT_DATA = `
SELECT * FROM workout WHERE id = $1 AND day = $2`

export const GET_SINGLE_WORKOUT = `
SELECT * FROM workout WHERE id = $1 AND DAY = $2 AND NAME = $3`

export const UPDATE_WORKOUT = `
UPDATE workout SET day = $1, name = $2, series = $3, reps = $4, kg = $5 WHERE id = $6`

export const DELETE_WORKOUT = `
DELETE FROM workout WHERE name = $1 and day = $2 WHERE id = $3`


