import { Router } from 'express';
import { client } from '../routes/Routes'
import { insertClientData, clientData, clientDataUpdate, clientDeleteData } from '../controller/client/clientController';
import { workoutData, insertWorkout } from '../controller/workout/workoutController';

const router = Router();

router.post(client.CREATE_CLIENT_ROUTE, insertClientData)
router.get(client.GET_CLIENT_DATA, clientData)
router.put(client.UPDATE_CLIENT_DATA, clientDataUpdate)
router.delete("/client/delete/:id", clientDeleteData)



router.get("/client/workout/data/:id", workoutData)

router.get("/insertar/:id", insertWorkout);
router.get("/find/:id", clientData);
router.get("/update/:id", clientDataUpdate);

// Rutas relacionadas con el ejercicio
/* 
router.get(`${GymProgressionRoutes.EXERCISES_ROUTE}${DataRoutes.GET_ALL_ROUTE}`, getAllExercisesController);
// Rutas relacionadas con el rendimiento
router.get(`${GymProgressionRoutes.PERFORMANCE_ROUTE}${DataRoutes.GET_ONE_ROUTE}`, getPerformanceController);
router.post(`${GymProgressionRoutes.PERFORMANCE_ROUTE}${DataRoutes.CREATE_ROUTE}`, createPerformanceController);
router.patch(`${GymProgressionRoutes.PERFORMANCE_ROUTE}${DataRoutes.UPDATE_ROUTE}`, updatePerformanceController);
 */

export default router;
