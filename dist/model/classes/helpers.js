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
exports.ResponseHandler = exports.Helper = void 0;
const errors_1 = require("../../errors");
class Helper {
    static verifyWorkout(client, res, id, clientWorkout) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { day, name } = clientWorkout;
                const response = yield client.query(`SELECT * FROM workout WHERE id = $1 AND DAY = $2 AND NAME = $3`, [id, day, name]);
                return response.rowCount;
            }
            catch (e) {
                (0, errors_1.GENERAL_ERROR_HANDLER)(e, res);
                return 0;
            }
        });
    }
}
exports.Helper = Helper;
class ResponseHandler {
    static sendSuccessMessage(res, data) {
        res.status(200).json({
            success: true,
            message: "Task successfully done",
            data: data
        });
    }
    static sendExerciseExists(res) {
        res.status(409).json({
            success: false,
            message: "Exercise already exists",
            data: null
        });
    }
    static sendIdNotFound(res) {
        res.status(404).json({
            success: false,
            message: "ID not found",
            data: null
        });
    }
    static sendIdFound(res, data) {
        res.status(202).json({
            success: true,
            message: "ID found",
            data: data
        });
    }
}
exports.ResponseHandler = ResponseHandler;
