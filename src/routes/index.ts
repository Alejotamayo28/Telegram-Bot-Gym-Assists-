import { Router } from 'express';
import { client, workout } from '../model/enum/Routes'
import { validateCreateClient, validateCreateClientData, validateIdClient, validateUpdateClientData } from '../middlewares/validators/client';
import { validateCreateWorkout, validateUpdateWorkout } from '../middlewares/validators/workout';
import { checkJwt, getClientDataTESTING } from '../middlewares/jsonWebToken/session';
import * as clientControllers from "../controller/client/clientController"
import * as workoutControllers from "../controller/workout/workoutController"

const router = Router();

router.get(client.LOGIN_CLIENT_ROUTE, clientControllers.loginClient) // catch id
router.post("/creando/", validateCreateClient, validateCreateClientData, clientControllers.singUpClient)

//router.post(client.CREATE_CLIENT_ROUTE, validateCreateClient, validateCreateClientData, clientControllers.insertClientData)

router.get(client.GET_CLIENT_DATA, validateIdClient, clientControllers.clientData)
router.put(client.UPDATE_CLIENT_DATA, validateIdClient, validateUpdateClientData, clientControllers.clientDataUpdate)
router.delete(client.DELETE_CLIENT_DATA, validateIdClient, clientControllers.clientDeleteData)

router.post(workout.CREATE_CLIENT_WORKOUT, validateIdClient, validateCreateWorkout, workoutControllers.insertWorkout)
router.get(workout.GET_CLIENT_WORKOUT_DATA, validateIdClient, workoutControllers.workoutData)
router.put(workout.UPDATE_CLIENT_WORKOUT_DATA, validateIdClient, validateUpdateWorkout, workoutControllers.UpdateWorkoutData)
router.delete(workout.DELETE_CLIENT_WORKOUT, validateIdClient, workoutControllers.deleteWorkoutData)

router.get("/probando/", checkJwt, getClientDataTESTING)

export default router;
