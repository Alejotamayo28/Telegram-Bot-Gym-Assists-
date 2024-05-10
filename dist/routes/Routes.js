"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataRoutes = exports.client = exports.GymProgressionRoutes = void 0;
var GymProgressionRoutes;
(function (GymProgressionRoutes) {
    GymProgressionRoutes["EXERCISES_ROUTE"] = "/exercises/";
    GymProgressionRoutes["PERFORMANCE_ROUTE"] = "/performance/";
})(GymProgressionRoutes || (exports.GymProgressionRoutes = GymProgressionRoutes = {}));
var client;
(function (client) {
    client["CREATE_CLIENT_ROUTE"] = "/client/singUp";
    client["LOGIN_CLIENT_ROUTE"] = "/client/login";
    client["GET_CLIENT_DATA"] = "/client/find/:id";
    client["UPDATE_CLIENT_DATA"] = "/client/update/:id";
})(client || (exports.client = client = {}));
var DataRoutes;
(function (DataRoutes) {
    DataRoutes["GET_ALL_ROUTE"] = "all/";
    DataRoutes["GET_ONE_ROUTE"] = "get/";
    DataRoutes["CREATE_ROUTE"] = "create/";
    DataRoutes["UPDATE_ROUTE"] = "update/";
})(DataRoutes || (exports.DataRoutes = DataRoutes = {}));
