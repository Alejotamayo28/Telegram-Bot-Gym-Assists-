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
exports.ClientManager = void 0;
const errors_1 = require("../../../errors");
const clientQueries_1 = require("./clientQueries");
class ClientManager {
    constructor(client, res) {
        this.client = client;
        this.res = res;
    }
    insertClient(clientData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nickname, password, age, gender, email, weight, height } = clientData;
                const responseId = yield this.client.query(clientQueries_1.INSERT_CLIENT_QUERY, [nickname, password]);
                yield this.client.query(clientQueries_1.INSERT_CLIENT_DATA_QUERY, [responseId.rows[0].id, age, gender, email, weight, height]);
            }
            catch (e) {
                (0, errors_1.GENERAL_ERROR_HANDLER)(e, this.res);
            }
        });
    }
    clientData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.client.query(clientQueries_1.GET_CLIENT_DATA, [id]);
                return response;
            }
            catch (e) {
                (0, errors_1.GENERAL_ERROR_HANDLER)(e, this.res);
                console.error(e);
            }
        });
    }
    clientUpdate(id, clientData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { age, gender, email, weight, height } = clientData;
                const response = yield this.client.query(clientQueries_1.GET_CLIENT_DATA, [id]);
                const data = {
                    age: age !== null && age !== void 0 ? age : response.rows[0].age,
                    gender: gender !== null && gender !== void 0 ? gender : response.rows[0].gender,
                    email: email !== null && email !== void 0 ? email : response.rows[0].email,
                    weight: weight !== null && weight !== void 0 ? weight : response.rows[0].weight,
                    height: height !== null && height !== void 0 ? height : response.rows[0].height
                };
                yield this.client.query(clientQueries_1.UPDATE_CLIENT_DATA, [data.age, data.gender, data.email, data.weight, data.height, id]);
            }
            catch (e) {
                (0, errors_1.GENERAL_ERROR_HANDLER)(e, this.res);
                console.error(e);
            }
        });
    }
    deleteClient(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                Promise.all([
                    yield this.client.query(clientQueries_1.DELETE_CLIENT_DATA, [id]),
                    yield this.client.query(clientQueries_1.DELETE_CLIENT_RECORDS, [id]),
                    yield this.client.query(clientQueries_1.DELETE_CLIENT, [id])
                ]);
            }
            catch (e) {
                (0, errors_1.GENERAL_ERROR_HANDLER)(e, this.res);
                console.error(e);
            }
        });
    }
}
exports.ClientManager = ClientManager;
