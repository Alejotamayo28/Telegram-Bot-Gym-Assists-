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
exports.insertClientWithId = void 0;
const insertClientWithId = (client, nickname, password, age, gender, email, weight, height) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield client.query(`INSERT INTO client (nickname, password) VALUES ($1, $2) RETURNING id`, [nickname, password]);
    yield client.query(`INSERT INTO client_data (id, age, gender, email, weight, height) VALUES ($1, $2, $3, $4, $5, $6)`, [response.rows[0].id, age, gender, email, weight, height]);
});
exports.insertClientWithId = insertClientWithId;
