import { Response, Router } from 'express';
import { client, workout } from '../model/enum/Routes'
import { validateCreateClient, validateCreateClientData, validateUpdateClientData } from '../middlewares/validators/client';
import { validateCreateWorkout, validateUpdateWorkout } from '../middlewares/validators/workout';
import * as clientControllers from "../controller/client/clientController"
import * as workoutControllers from "../controller/workout/workoutController"
import { authenticateToken } from '../middlewares/authorization/auth';
import { RequestExt } from '../middlewares/jsonWebToken/enCryptHelper';
import { updateClientData } from '../queries/clientQueries';
import { pool } from '../database/database';
import { PoolClient } from 'pg';

const router = Router();

// Client Routes

router.get(client.LOGIN_CLIENT_ROUTE, clientControllers.loginClient)
router.post(client.CREATE_CLIENT_ROUTE, validateCreateClient, validateCreateClientData, clientControllers.singUpClient)
router.get(client.GET_CLIENT_DATA, authenticateToken, clientControllers.clientData)
router.put(client.UPDATE_CLIENT_DATA, authenticateToken, validateUpdateClientData, clientControllers.clientDataUpdate)
router.delete(client.DELETE_CLIENT_DATA, authenticateToken, clientControllers.clientDeleteData)

// Workout Routes

router.delete(workout.DELETE_CLIENT_WORKOUT, authenticateToken, workoutControllers.deleteWorkoutData)
router.put(workout.UPDATE_CLIENT_WORKOUT_DATA, authenticateToken, validateUpdateWorkout, workoutControllers.UpdateWorkoutData)
router.get(workout.GET_CLIENT_WORKOUT_DATA, authenticateToken, workoutControllers.workoutData)
router.post(workout.CREATE_CLIENT_WORKOUT, authenticateToken, validateCreateWorkout, workoutControllers.insertWorkout)

/*router.put(client.UPDATE_CLIENT_DATA, authenticateToken, async (req: RequestExt, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(403).json({ error: 'Usuario no autenticado' });
  }
  const clientId = user.id // Obtener el ID del cliente del token JWT
  const { age, gender, email, weight, height } = req.body;

  let client: PoolClient | null = null;

  try {
    client = await pool.connect();
    await updateClientData(client, clientId, { age, gender, email, weight, height });
    res.json({ message: 'Datos del cliente actualizados correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar los datos del cliente' });
    console.error(error)
  } finally {
    client?.release();
  }
});
*/
export default router;
