import { Router } from 'express';
import { client, workout } from '../model/enum/Routes'
import { insertClientData, clientData, clientDataUpdate, clientDeleteData, loginClient, singUpClient } from '../controller/client/clientController';
import { workoutData, insertWorkout, UpdateWorkoutData, deleteWorkoutData } from '../controller/workout/workoutController';
import { validateCreateClient, validateCreateClientData, validateIdClient, validateUpdateClientData } from '../middlewares/validators/client';
import { validateCreateWorkout, validateUpdateWorkout } from '../middlewares/validators/workout';
import { checkJwt, getClientDataTESTING } from '../middlewares/jsonWebToken/session';

const router = Router();



router.get(client.LOGIN_CLIENT_ROUTE, loginClient) // catch id
router.post("/creando/", singUpClient)

router.post(client.CREATE_CLIENT_ROUTE, validateCreateClient, validateCreateClientData, insertClientData)
router.get(client.GET_CLIENT_DATA, validateIdClient, clientData)
router.put(client.UPDATE_CLIENT_DATA, validateIdClient, validateUpdateClientData, clientDataUpdate)
router.delete(client.DELETE_CLIENT_DATA, validateIdClient, clientDeleteData)

router.post(workout.CREATE_CLIENT_WORKOUT, validateIdClient, validateCreateWorkout, insertWorkout)
router.get(workout.GET_CLIENT_WORKOUT_DATA, validateIdClient, workoutData)
router.put(workout.UPDATE_CLIENT_WORKOUT_DATA, validateIdClient, validateUpdateWorkout, UpdateWorkoutData)
router.delete(workout.DELETE_CLIENT_WORKOUT, validateIdClient, deleteWorkoutData)

router.get("/probando/", checkJwt, getClientDataTESTING)

export default router;
