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
exports.clientDeleteData = exports.clientDataUpdate = exports.clientData = exports.insertClientData = void 0;
const database_1 = require("../../database/database");
const errors_1 = require("../../errors");
const responseClasses_1 = require("../../model/classes/responseClasses");
const clientManager_1 = require("./clientManager");
const insertClientData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        const { body } = req;
        client = yield database_1.pool.connect();
        yield new clientManager_1.ClientManager(client, res).insertClient(body);
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
exports.insertClientData = insertClientData;
const clientData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        const { id } = req.params;
        client = yield database_1.pool.connect();
        const { rowCount, rows } = yield new clientManager_1.ClientManager(client, res).clientData(id);
        if (!rowCount)
            responseClasses_1.ResponseHandler.sendIdNotFound(res);
        if (rowCount)
            responseClasses_1.ResponseHandler.sendIdFound(res, rows);
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
        yield new clientManager_1.ClientManager(client, res).clientUpdate(id, body);
        responseClasses_1.ResponseHandler.sendSuccessMessage(res, body);
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
const clientDeleteData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        client = yield database_1.pool.connect();
        const { id } = req.params;
        yield new clientManager_1.ClientManager(client, res).deleteClient(id);
        responseClasses_1.ResponseHandler.sendSuccessMessage(res, id);
    }
    catch (e) {
        (0, errors_1.GENERAL_ERROR_HANDLER)(e, res);
        console.error(e);
    }
    client && client.release();
});
exports.clientDeleteData = clientDeleteData;
