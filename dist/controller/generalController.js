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
exports.clientDataUpdate = exports.clientData = exports.insertWorkout = exports.insertClientData = void 0;
const database_1 = require("../database/database");
const classes_1 = require("../model/classes");
const helpers_1 = require("../model/classes/helpers");
const errors_1 = require("../errors");
const insertClientData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        const { body } = req;
        client = yield database_1.pool.connect();
        yield classes_1.ClientManager.insertClient(client, res, body);
        helpers_1.ResponseHandler.sendSuccessMessage(res, body);
    }
    catch (e) {
        (0, errors_1.GENERAL_ERROR_HANDLER)(e, res);
        console.error(e);
    }
    finally {
        client && client.release();
    }
});
exports.insertClientData = insertClientData;
const insertWorkout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        const { body, params } = req;
        const { id } = params;
        client = yield database_1.pool.connect();
        if ((yield helpers_1.Helper.verifyWorkout(client, res, id, body)) !== 0) {
            helpers_1.ResponseHandler.sendExerciseExists(res);
        }
        else {
            yield classes_1.WorkoutManager.insertWorkout(client, res, id, body);
            helpers_1.ResponseHandler.sendSuccessMessage(res, body);
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
const clientData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        const { id } = req.params;
        client = yield database_1.pool.connect();
        const { rowCount, rows } = yield classes_1.ClientManager.clientData(client, res, id);
        if (rowCount === 0) {
            helpers_1.ResponseHandler.sendIdNotFound(res);
        }
        else {
            helpers_1.ResponseHandler.sendIdFound(res, rows);
        }
    }
    catch (e) {
        (0, errors_1.GENERAL_ERROR_HANDLER)(e, res);
        console.log(e);
    }
    finally {
        client && client.release();
    }
});
exports.clientData = clientData;
const clientDataUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        const { id } = req.params;
        const { body } = req;
        client = yield database_1.pool.connect();
        yield classes_1.ClientManager.clientUpdate(client, id, body);
        helpers_1.ResponseHandler.sendSuccessMessage(res, body);
    }
    catch (e) {
        (0, errors_1.GENERAL_ERROR_HANDLER)(e, res);
        console.log(e);
    }
    finally {
        client && client.release();
    }
});
exports.clientDataUpdate = clientDataUpdate;
