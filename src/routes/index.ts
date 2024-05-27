import { Router } from 'express';
import { client, workout } from '../model/enum/Routes'
import { validateCreateClient, validateCreateClientData, validateIdClient, validateUpdateClientData } from '../middlewares/validators/client';
import { validateCreateWorkout, validateUpdateWorkout } from '../middlewares/validators/workout';
import * as clientControllers from "../controller/client/clientController"
import * as workoutControllers from "../controller/workout/workoutController"
import { authenticateToken } from '../middlewares/authorization/auth';

const router = Router();

// Client Routes

router.get(client.LOGIN_CLIENT_ROUTE, clientControllers.loginClient)
router.post(client.CREATE_CLIENT_ROUTE, validateCreateClient, validateCreateClientData, clientControllers.singUpClient)
router.get(client.GET_CLIENT_DATA, authenticateToken, validateIdClient, clientControllers.clientData)
router.put(client.UPDATE_CLIENT_DATA, authenticateToken, validateIdClient, validateUpdateClientData, clientControllers.clientDataUpdate)
router.delete(client.DELETE_CLIENT_DATA, authenticateToken, validateIdClient, clientControllers.clientDeleteData)

// Workout Routes

router.delete(workout.DELETE_CLIENT_WORKOUT, authenticateToken, validateIdClient, workoutControllers.deleteWorkoutData)
router.put(workout.UPDATE_CLIENT_WORKOUT_DATA, authenticateToken, validateIdClient, validateUpdateWorkout, workoutControllers.UpdateWorkoutData)
router.get(workout.GET_CLIENT_WORKOUT_DATA, authenticateToken, validateIdClient, workoutControllers.workoutData)
router.post(workout.CREATE_CLIENT_WORKOUT, authenticateToken, validateIdClient, validateCreateWorkout, workoutControllers.insertWorkout)

export default router;
