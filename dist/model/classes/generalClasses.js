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
const queriesClasses_1 = require("./queriesClasses");
class ClientManager {
    constructor(client, res) {
        this.client = client;
        this.res = res;
    }
    insertClient(clientData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseId = yield new queriesClasses_1.ClientQueries(this.client, this.res).postClientQuery(clientData);
                yield new queriesClasses_1.ClientQueries(this.client, this.res).postClientDataQuery(responseId, clientData);
            }
            catch (e) {
                (0, errors_1.GENERAL_ERROR_HANDLER)(e, this.res);
            }
        });
    }
    clientData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield new queriesClasses_1.ClientQueries(this.client, this.res).getClientData(id);
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
                const { nickname, password, age, gender, email, weight, height } = clientData;
                const response = yield new queriesClasses_1.ClientQueries(this.client, this.res).getClientData(id);
                const data = {
                    nickname: nickname !== null && nickname !== void 0 ? nickname : response.rows[0].nickname,
                    password: password !== null && password !== void 0 ? password : response.rows[0].password,
                    age: age !== null && age !== void 0 ? age : response.rows[0].age,
                    gender: gender !== null && gender !== void 0 ? gender : response.rows[0].gender,
                    email: email !== null && email !== void 0 ? email : response.rows[0].email,
                    weight: weight !== null && weight !== void 0 ? weight : response.rows[0].weight,
                    height: height !== null && height !== void 0 ? height : response.rows[0].height
                };
                yield new queriesClasses_1.ClientQueries(this.client, this.res).updateClient(id, data);
            }
            catch (e) {
                (0, errors_1.GENERAL_ERROR_HANDLER)(e, this.res);
                console.error(e);
            }
        });
    }
}
exports.ClientManager = ClientManager;
class WorkoutManager {
    constructor(client, res) {
        this.client = client;
        this.res = res;
    }
    insertWorkout(id, clientWorkout) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { day, name, series, reps, kg } = clientWorkout;
                yield this.client.query(`INSERT INTO workout (id,day,name,series,reps,kg) VALUES ($1,$2,$3,$4,$5,$6)`, [id, day, name, series, reps, kg]);
            }
            catch (e) {
                (0, errors_1.GENERAL_ERROR_HANDLER)(e, this.res);
                console.error(e);
            }
        });
    }
    workoutData(id, clientWorkout) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { day } = clientWorkout;
                const response = yield this.client.query(`SELECT * FROM workout WHERE id = $1 and day = $2 `, [id, day]);
                return response;
            }
            catch (e) {
                (0, errors_1.GENERAL_ERROR_HANDLER)(e, this.res);
            }
        });
    }
    verifyWorkout(id, clientWorkout) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { day, name } = clientWorkout;
                const response = yield this.client.query(`SELECT * FROM workout WHERE id = $1 AND DAY = $2 AND NAME = $3`, [id, day, name]);
                return response.rowCount;
            }
            catch (e) {
                (0, errors_1.GENERAL_ERROR_HANDLER)(e, this.res);
                return 0;
            }
        });
    }
}
exports.WorkoutManager = WorkoutManager;
