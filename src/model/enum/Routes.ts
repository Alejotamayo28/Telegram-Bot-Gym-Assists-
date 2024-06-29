export enum client {
  REGISTER = "/clients",
  LOGIN = "/clients/login/",
  GET_PROFILE = "/clients/me/",
  UPDATE_PROFILE = "/update/",
  DELETE_PROFILE = "/client/me/delete/"
}

export enum workout {
  CREATE_WORKOUT = "/client/me/workout/",
  GET_WORKOUTS = "/client/me/workout",
  UPDATE_WORKOUT = "/client/me/workout/",
  DELETE_WORKOUT = "/client/me/workout/"
}
