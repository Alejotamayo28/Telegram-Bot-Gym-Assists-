
export const INSERT_CLIENT_QUERY = `
INSERT INTO client (nickname, password) VALUES ($1, $2) RETURNING id`

export const INSERT_CLIENT_DATA_QUERY = `
INSERT INTO client_data (id, age, gender, email, weight, height) VALUES ($1, $2, $3, $4, $5, $6)`

export const GET_CLIENT_DATA = `
SELECT * FROM client_data WHERE id = $1`

export const UPDATE_CLIENT_DATA = `
UPDATE client_data SET age = $1, gender = $2, email = $3, weight = $4, height = $5 WHERE id = $6`

export const DELETE_CLIENT_DATA = `
DELETE FROM client_data WHERE id = $1`

export const DELETE_CLIENT = `
DELETE FROM client WHERE id = $1`

export const DELETE_CLIENT_RECORDS = `
DELETE FROM workout WHERE id = $1`

export const GET_CLIENT_NICKNAME = `
SELECT * FROM client WHERE nickname = $1`
