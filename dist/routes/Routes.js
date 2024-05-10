"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workout = exports.client = void 0;
var client;
(function (client) {
    client["CREATE_CLIENT_ROUTE"] = "/client/singUp/";
    client["LOGIN_CLIENT_ROUTE"] = "/client/login/";
    client["GET_CLIENT_DATA"] = "/client/find/:id";
    client["UPDATE_CLIENT_DATA"] = "/client/update/:id";
    client["DELETE_CLIENT_DATA"] = "/client/delete/:id";
})(client || (exports.client = client = {}));
var workout;
(function (workout) {
    workout["CREATE_CLIENT_WORKOUT"] = "/client/create/workout/:id";
    workout["GET_CLIENT_WORKOUT_DATA"] = "/client/find/:id";
    workout["UPDATE_CLIENT_WORKOUT_DATA"] = "/client/update/workout/:id";
    workout["DELETE_CLIENT_WORKOUT"] = "/client/delete/workout/:id";
})(workout || (exports.workout = workout = {}));
