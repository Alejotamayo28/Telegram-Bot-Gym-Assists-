"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHandler = void 0;
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
