"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GENERAL_ERROR_HANDLER = void 0;
const GENERAL_ERROR_HANDLER = (e, res) => {
    console.error(`Internal server Error: ${e instanceof Error ? e.message : "Unknown"}`);
    return res.status(500).json({ message: "Internal Server Error" });
};
exports.GENERAL_ERROR_HANDLER = GENERAL_ERROR_HANDLER;
