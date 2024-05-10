import { Router } from 'express';
import { client, workout } from '../model/enum/Routes'
import { insertClientData, clientData, clientDataUpdate, clientDeleteData } from '../controller/client/clientController';
import { workoutData, insertWorkout, UpdateWorkoutData, deleteWorkoutData } from '../controller/workout/workoutController';
import { validateCreateClient, validateCreateClientData, validateIdClient, validateUpdateClientData } from '../validators/client';
import { validateCreateWorkout, validateUpdateWorkout } from '../validators/workout';

const router = Router();

router.post(client.CREATE_CLIENT_ROUTE, validateCreateClient, validateCreateClientData, insertClientData)
router.get(client.GET_CLIENT_DATA, validateIdClient, clientData)
router.put(client.UPDATE_CLIENT_DATA, validateIdClient, validateUpdateClientData, clientDataUpdate)
router.delete(client.DELETE_CLIENT_DATA, validateIdClient, clientDeleteData)

router.post(workout.CREATE_CLIENT_WORKOUT, validateIdClient, validateCreateWorkout, insertWorkout)
router.get(workout.GET_CLIENT_WORKOUT_DATA, validateIdClient, workoutData)
router.put(workout.UPDATE_CLIENT_WORKOUT_DATA, validateIdClient, validateUpdateWorkout, UpdateWorkoutData)
router.delete(workout.DELETE_CLIENT_WORKOUT, validateIdClient, deleteWorkoutData)

export default router;
