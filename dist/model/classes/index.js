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
exports.WorkoutManager = exports.ClientManager = void 0;
const errors_1 = require("../../errors");
const helpers_1 = require("./helpers");
class ClientManager {
    static insertClient(client, res, clientData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nickname, password, age, gender, email, weight, height } = clientData;
                const clientInsertResult = yield client.query(`INSERT INTO client (nickname, password) VALUES ($1, $2) RETURNING id`, [nickname, password]);
                const clientId = clientInsertResult.rows[0].id;
                yield client.query(`INSERT INTO client_data (id, age, gender, email, weight, height) VALUES ($1, $2, $3, $4, $5, $6)`, [clientId, age, gender, email, weight, height]);
            }
            catch (e) {
                (0, errors_1.GENERAL_ERROR_HANDLER)(e, res);
            }
        });
    }
    static clientData(client, res, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield client.query(`SELECT * FROM client_data where id = $1`, [id]);
                return response;
            }
            catch (e) {
                (0, errors_1.GENERAL_ERROR_HANDLER)(e, res);
            }
        });
    }
    static clientUpdate(client, id, clientData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { age, gender, email, weight, height } = clientData;
            const response = yield client.query(`SELECT * FROM client_data where id = $1`, [id]);
            const data = {
                age: age !== undefined ? age : response.rows[0].age,
                gender: gender !== undefined ? gender : response.rows[0].gender,
                email: email !== undefined ? email : response.rows[0].email,
                weight: weight !== undefined ? weight : response.rows[0].weight,
                height: height !== undefined ? height : response.rows[0].height
            };
            yield client.query(`UPDATE client_data SET age = $1, gender = $2, email = $3, weight = $4, height = $5 WHERE id = $6`, [data.age, data.gender, data.email, data.weight, data.height, id]);
        });
    }
}
exports.ClientManager = ClientManager;
class WorkoutManager extends helpers_1.Helper {
    static insertWorkout(client, res, id, clientWorkout) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { day, name, series, reps, kg } = clientWorkout;
                yield client.query(`INSERT INTO workout (id,day,name,series,reps,kg) VALUES ($1,$2,$3,$4,$5,$6)`, [id, day, name, series, reps, kg]);
            }
            catch (e) {
                (0, errors_1.GENERAL_ERROR_HANDLER)(e, res);
            }
        });
    }
    static workoutData(client, res, id, clientWorkout) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { day } = clientWorkout;
                const response = yield client.query(`SELECT * FROM workout WHERE id = $1 and day = $2 `, [id, day]);
                return response;
            }
            catch (e) {
                (0, errors_1.GENERAL_ERROR_HANDLER)(e, res);
            }
        });
    }
}
exports.WorkoutManager = WorkoutManager;
