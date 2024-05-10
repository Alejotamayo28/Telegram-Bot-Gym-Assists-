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
exports.WorkoutManager = void 0;
const errors_1 = require("../../errors");
const workoutQueries_1 = require("./workoutQueries");
class WorkoutManager {
    constructor(client, res) {
        this.client = client;
        this.res = res;
    }
    insertWorkout(id, clientWorkout) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { day, name, series, reps, kg } = clientWorkout;
                yield this.client.query(workoutQueries_1.INSERT_WORKOUT_QUERY, [id, day, name, series, reps, kg]);
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
                const response = yield this.client.query(workoutQueries_1.GET_WORKOUT_DATA, [id, day]);
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
                const response = yield this.client.query(workoutQueries_1.GET_SINGLE_WORKOUT, [id, day, name]);
                return response.rowCount;
            }
            catch (e) {
                (0, errors_1.GENERAL_ERROR_HANDLER)(e, this.res);
                console.error(e);
            }
        });
    }
    UpdateWorkout(id, clientWorkout) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { day, name, series, reps, kg } = clientWorkout;
                const response = yield this.client.query(workoutQueries_1.GET_WORKOUT_DATA, [id, day]);
                const data = {
                    day: day !== null && day !== void 0 ? day : response.rows[0].day,
                    name: name !== null && name !== void 0 ? name : response.rows[0].name,
                    series: series !== null && series !== void 0 ? series : response.rows[0].series,
                    reps: reps !== null && reps !== void 0 ? reps : response.rows[0].reps,
                    kg: kg !== null && kg !== void 0 ? kg : response.rows[0].kg
                };
                yield this.client.query(workoutQueries_1.UPDATE_WORKOUT, [data.day, data.name, data.series, data.reps, data.kg, id]);
            }
            catch (e) {
                (0, errors_1.GENERAL_ERROR_HANDLER)(e, this.res);
                console.error(e);
            }
        });
    }
    deleteWorkout(id, clientWorkout) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { day, name } = clientWorkout;
                yield this.client.query(workoutQueries_1.DELETE_WORKOUT, [name, day, id]);
            }
            catch (e) {
                (0, errors_1.GENERAL_ERROR_HANDLER)(e, this.res);
                console.error(e);
            }
        });
    }
}
exports.WorkoutManager = WorkoutManager;
