import { Router } from 'express';
import { client, workout } from '../model/enum/Routes'
import { validateCreateClient, validateCreateClientData, validateLoginClient, validateUpdateClientData } from '../middlewares/validators/client';
import { validateCreateWorkout, validateUpdateWorkout } from '../middlewares/validators/workout';
import { authenticateToken } from '../middlewares/authorization/auth';
import { loginClient, singUpClient, clientData, clientDataUpdate, clientDeleteData } from '../controller/client/clientController';
import { workoutData, deleteWorkoutData, insertWorkout, UpdateWorkoutData } from '../controller/workout/workoutController';

const router = Router();

// Client Routes

router.get(client.LOGIN, validateLoginClient, loginClient)
router.post(client.REGISTER, validateCreateClient, validateCreateClientData, singUpClient)
router.get(client.GET_PROFILE, authenticateToken, clientData)
router.put(client.UPDATE_PROFILE, authenticateToken, validateUpdateClientData, clientDataUpdate)
router.delete(client.DELETE_PROFILE, authenticateToken, clientDeleteData)

// Workout Routes

router.delete(workout.DELETE_WORKOUT, authenticateToken, deleteWorkoutData)
router.patch(workout.UPDATE_WORKOUT, authenticateToken, validateUpdateWorkout, UpdateWorkoutData)
router.get(workout.GET_WORKOUTS, authenticateToken, workoutData)
router.post(workout.CREATE_WORKOUT, authenticateToken, validateCreateWorkout, insertWorkout)

export default router;
