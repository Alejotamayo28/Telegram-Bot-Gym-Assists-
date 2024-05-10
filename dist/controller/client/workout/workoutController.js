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
exports.UpdateWorkoutData = exports.deleteWorkoutData = exports.workoutData = exports.insertWorkout = void 0;
const database_1 = require("../../../database/database");
const errors_1 = require("../../../errors");
const responseClasses_1 = require("../../../model/classes/responseClasses");
const workoutManager_1 = require("./workoutManager");
const insertWorkout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        const { body } = req;
        const { id } = req.params;
        client = yield database_1.pool.connect();
        if ((yield new workoutManager_1.WorkoutManager(client, res).verifyWorkout(id, body)) !== 0) {
            responseClasses_1.ResponseHandler.sendExerciseExists(res);
        }
        else {
            yield new workoutManager_1.WorkoutManager(client, res).insertWorkout(id, body);
            responseClasses_1.ResponseHandler.sendSuccessMessage(res, body);
        }
    }
    catch (e) {
        (0, errors_1.GENERAL_ERROR_HANDLER)(e, res);
        console.error(e);
    }
    finally {
        client && client.release();
    }
});
exports.insertWorkout = insertWorkout;
const workoutData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        const { id } = req.params;
        const { body } = req;
        client = yield database_1.pool.connect();
        const response = yield new workoutManager_1.WorkoutManager(client, res).workoutData(id, body);
        responseClasses_1.ResponseHandler.sendSuccessMessage(res, response === null || response === void 0 ? void 0 : response.rows);
    }
    catch (e) {
        (0, errors_1.GENERAL_ERROR_HANDLER)(e, res);
        console.error(e);
    }
    finally {
        client && client.release();
    }
});
exports.workoutData = workoutData;
const deleteWorkoutData = (_a, res_1) => __awaiter(void 0, [_a, res_1], void 0, function* ({ params, body }, res) {
    let client;
    try {
        client = yield database_1.pool.connect();
        const { id } = params;
        yield new workoutManager_1.WorkoutManager(client, res).deleteWorkout(id, body);
        responseClasses_1.ResponseHandler.sendSuccessMessage(res, body);
    }
    catch (e) {
        (0, errors_1.GENERAL_ERROR_HANDLER)(e, res);
        console.error(e);
    }
    finally {
        client && client.release();
    }
});
exports.deleteWorkoutData = deleteWorkoutData;
const UpdateWorkoutData = (_b, res_2) => __awaiter(void 0, [_b, res_2], void 0, function* ({ params, body }, res) {
    let client;
    try {
        client = yield database_1.pool.connect();
        const { id } = params;
        yield new workoutManager_1.WorkoutManager(client, res).UpdateWorkout(id, body);
        responseClasses_1.ResponseHandler.sendSuccessMessage(res, body);
    }
    catch (e) {
        (0, errors_1.GENERAL_ERROR_HANDLER)(e, res);
        console.error(e);
    }
    finally {
        client && client.release();
    }
});
exports.UpdateWorkoutData = UpdateWorkoutData;
