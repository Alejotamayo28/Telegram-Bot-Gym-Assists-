"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractData = void 0;
const extractData = (req, res, next) => {
    const { day, name, series, reps, kg } = req.params;
    next();
};
exports.extractData = extractData;
