export enum client {
    CREATE_CLIENT_ROUTE = "/client/singUp/",
    LOGIN_CLIENT_ROUTE = "/client/login/",
    GET_CLIENT_DATA = "/client/find/:id",
    UPDATE_CLIENT_DATA = "/client/update/:id",
    DELETE_CLIENT_DATA = "/client/delete/:id"
}

export enum workout {
    CREATE_CLIENT_WORKOUT = "/client/create/workout/:id",
    GET_CLIENT_WORKOUT_DATA = "/client/find/:id",
    UPDATE_CLIENT_WORKOUT_DATA = "/client/update/workout/:id",
    DELETE_CLIENT_WORKOUT = "/client/delete/workout/:id"
}
