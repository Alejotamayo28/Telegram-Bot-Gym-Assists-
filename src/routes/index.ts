import { Router } from 'express';
import { client, workout } from '../routes/Routes'
import { insertClientData, clientData, clientDataUpdate, clientDeleteData } from '../controller/client/clientController';
import { workoutData, insertWorkout, UpdateWorkoutData, deleteWorkoutData } from '../controller/workout/workoutController';

const router = Router();

router.post(client.CREATE_CLIENT_ROUTE, insertClientData)
router.get(client.GET_CLIENT_DATA, clientData)
router.put(client.UPDATE_CLIENT_DATA, clientDataUpdate)
router.delete(client.DELETE_CLIENT_DATA, clientDeleteData)

router.post(workout.CREATE_CLIENT_WORKOUT, insertWorkout)
router.get(workout.GET_CLIENT_WORKOUT_DATA, workoutData)
router.put(workout.UPDATE_CLIENT_WORKOUT_DATA, UpdateWorkoutData)
router.delete(workout.DELETE_CLIENT_WORKOUT, deleteWorkoutData)

export default router;
