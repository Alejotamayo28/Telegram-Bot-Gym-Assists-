"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generalController_1 = require("../controller/generalController");
const router = (0, express_1.Router)();
router.get("/probando", generalController_1.insertClientData);
router.get("/probando/:id", generalController_1.insertWorkout);
router.get("/find/:id", generalController_1.clientData);
router.get("/update/:id", generalController_1.clientDataUpdate);
// Rutas relacionadas con el ejercicio
/*
router.get(`${GymProgressionRoutes.EXERCISES_ROUTE}${DataRoutes.GET_ALL_ROUTE}`, getAllExercisesController);
// Rutas relacionadas con el rendimiento
router.get(`${GymProgressionRoutes.PERFORMANCE_ROUTE}${DataRoutes.GET_ONE_ROUTE}`, getPerformanceController);
router.post(`${GymProgressionRoutes.PERFORMANCE_ROUTE}${DataRoutes.CREATE_ROUTE}`, createPerformanceController);
router.patch(`${GymProgressionRoutes.PERFORMANCE_ROUTE}${DataRoutes.UPDATE_ROUTE}`, updatePerformanceController);
 */
exports.default = router;
