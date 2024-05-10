"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_CLIENT_RECORDS = exports.DELETE_CLIENT = exports.DELETE_CLIENT_DATA = exports.UPDATE_CLIENT_DATA = exports.GET_CLIENT_DATA = exports.INSERT_CLIENT_DATA_QUERY = exports.INSERT_CLIENT_QUERY = void 0;
exports.INSERT_CLIENT_QUERY = `
INSERT INTO client (nickname, password) VALUES ($1, $2) RETURNING id`;
exports.INSERT_CLIENT_DATA_QUERY = `
INSERT INTO client_data (id, age, gender, email, weight, height) VALUES ($1, $2, $3, $4, $5, $6)`;
exports.GET_CLIENT_DATA = `
SELECT * FROM client_data WHERE id = $1`;
exports.UPDATE_CLIENT_DATA = `
UPDATE client_data SET age = $1, gender = $2, email = $3, weight = $4, height = $5 WHERE id = $6`;
exports.DELETE_CLIENT_DATA = `
DELETE FROM client_data WHERE id = $1`;
exports.DELETE_CLIENT = `
DELETE FROM client WHERE id = $1`;
exports.DELETE_CLIENT_RECORDS = `
DELETE FROM workout WHERE id = $1`;
