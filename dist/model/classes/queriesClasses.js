"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientQueries = void 0;
const errors_1 = require("../../errors");
const INSERT_CLIENT_QUERY = `
INSERT INTO client (nickname, password) VALUES ($1, $2) RETURNING id`;
const INSERT_CLIENT_DATA_QUERY = `
INSERT INTO client_data (id, age, gender, email, weight, height) VALUES ($1, $2, $3, $4, $5, $6)`;
const GET_CLIENT_DATA = `
SELECT * FROM client_data WHERE id = $1`;
const UPDATE_CLIENT_DATA = `
UPDATE client_data SET age = $1, gender = $2, email = $3, weight = $4, height = $5 WHERE id = $6`;
class ClientQueries {
    constructor(client, res) {
        this.client = client;
        this.res = res;
    }
    postClientQuery(clientData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nickname, password } = clientData;
                const response = yield this.client.query(INSERT_CLIENT_QUERY, [nickname, password]);
                return response.rows[0].id;
            }
            catch (e) {
                (0, errors_1.GENERAL_ERROR_HANDLER)(e, this.res);
                console.error(e);
            }
        });
    }
    postClientDataQuery(id, clientData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { age, gender, email, weight, height } = clientData;
                yield this.client.query(INSERT_CLIENT_DATA_QUERY, [id, age, gender, email, weight, height]);
            }
            catch (e) {
                (0, errors_1.GENERAL_ERROR_HANDLER)(e, this.res);
                console.error(e);
            }
        });
    }
    getClientData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.client.query(GET_CLIENT_DATA, [id]);
                return response;
            }
            catch (e) {
                (0, errors_1.GENERAL_ERROR_HANDLER)(e, this.res);
                console.error(e);
            }
        });
    }
    updateClient(id, clientData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.query(UPDATE_CLIENT_DATA, [
                    clientData.age, clientData.gender, clientData.email, clientData.weight, clientData.height, id
                ]);
            }
            catch (e) {
                (0, errors_1.GENERAL_ERROR_HANDLER)(e, this.res);
                console.error(e);
            }
        });
    }
}
exports.ClientQueries = ClientQueries;
