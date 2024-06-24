import { Router } from 'express';
import { client, workout } from '../model/enum/Routes'
import { validateCreateClient, validateCreateClientData, validateUpdateClientData } from '../middlewares/validators/client';
import { validateCreateWorkout, validateUpdateWorkout } from '../middlewares/validators/workout';
import { authenticateToken } from '../middlewares/authorization/auth';
import { loginClient, singUpClient, clientData, clientDataUpdate, clientDeleteData } from '../controller/client/clientController';
import { workoutData, deleteWorkoutData, insertWorkout, UpdateWorkoutData } from '../controller/workout/workoutController';

const router = Router();

// Client Routes

router.get(client.LOGIN_CLIENT_ROUTE, loginClient)
router.post(client.CREATE_CLIENT_ROUTE, validateCreateClient, validateCreateClientData, singUpClient)
router.get(client.GET_CLIENT_DATA, authenticateToken, clientData)
router.put(client.UPDATE_CLIENT_DATA, authenticateToken, validateUpdateClientData, clientDataUpdate)
router.delete(client.DELETE_CLIENT_DATA, authenticateToken, clientDeleteData)

// Workout Routes

router.delete(workout.DELETE_CLIENT_WORKOUT, authenticateToken, deleteWorkoutData)
router.put(workout.UPDATE_CLIENT_WORKOUT, authenticateToken, validateUpdateWorkout, UpdateWorkoutData)
router.get(workout.GET_CLIENT_WORKOUT, authenticateToken, workoutData)
router.post(workout.CREATE_CLIENT_WORKOUT, authenticateToken, validateCreateWorkout, insertWorkout)

export default router;
