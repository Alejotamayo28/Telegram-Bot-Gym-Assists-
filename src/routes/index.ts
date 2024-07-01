import { Router, response } from 'express';
import { client, workout } from '../model/enum/Routes'
import { validateCreateClient, validateCreateClientData, validateLoginClient, validateUpdateClientData } from '../middlewares/validators/client';
import { validateCreateWorkout, validateUpdateWorkout } from '../middlewares/validators/workout';
import { authenticateToken } from '../middlewares/authorization/auth';
import { Twilio } from 'twilio'
import { QueryResult } from 'pg';
import { pool } from '../database/database';
import { compare } from 'bcryptjs';
import { encrypt } from '../middlewares/jsonWebToken/enCryptHelper';
import dotenv from 'dotenv'
import { ClientData } from '../model/interface/client';
import { insertClientDataQuery, insertClientQuery, verifyNickname } from '../queries/clientQueries';
import { withTimeout } from '../errors';
import { ClientWorkout } from '../model/interface/workout';
import { deleteWorkoutDataQuery, getSingleWorkoutDataQuery, getWorkoutAllDataQuery, insertWorkoutQuery, updateWorkoutData } from '../queries/workoutQueries';
import { UserSession, loginPage, loginPageExample, loginPagePasswordIncorrect, loginPageUserNotFound, mainPage, menuPage, menuPageCreateExercise, menuPageDeleteExercise, menuPageGetExercisePerDay, menuPageGetExercises, menuPageUpdateExercise, menuPageUserNotFound, singUpPage, singUpPageExample, singUpPageUserNotAvailable, userCreatedSuccesfully, userLoginSuccesfully } from '../bot/botMessages';

const router = Router();

dotenv.config()

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client1 = new Twilio(accountSid, authToken)

router.post('/send-message', async (req, res) => {
  const { to, message } = req.body
  try {
    const messageResponse = await client1.messages.create({
      body: message,
      from: process.env.FROM_WHATSAPP,
      to: `whatsapp:${to}`
    })
    res.status(200).send({ success: true, messageId: messageResponse.sid })
  } catch (e) {
    console.log('ayuda')
  }
})

let userState = 'start'

const userSession = new UserSession()

router.post('/webhook', async (req, res) => {
  const clientQuery = await pool.connect()
  const { Body } = req.body;
  let responseMessage = '';

  switch (userState) {
    case 'start':
      if (Body && Body.toLowerCase() === 'hola') {
        responseMessage = mainPage()
        userState = 'selectOption';
      } else {
        responseMessage = 'No he entendido ese comando. Por favor, escribe "Hola" para comenzar.';
      }
      break;

    case 'selectOption':
      if (Body && Body === '1') {
        responseMessage = loginPage()
        userState = 'enterCredentialsLogin';
      } else if (Body && Body === '2') {
        responseMessage = singUpPage();
        userState = 'enterCredentialsSingUp';
      } else if (Body && Body === '11') {
        responseMessage = loginPageExample();
        userState = 'start';
      } else if (Body && Body === '22') {
        responseMessage = singUpPageExample()
        userState = 'start';
      } else {
        responseMessage = 'Opción no válida. Por favor, selecciona una de las opciones disponibles.';
        userState = 'start';
      }
      break;

    case 'enterCredentialsSingUp':
      if (Body && Body.includes(' ')) {
        const [nickname, password, first_name, last_name, age, gender, email, weight, height] = Body.split(' ')
        const data: ClientData = {
          nickname: nickname, password: password, first_name: first_name, last_name: last_name,
          age: age, gender: gender, email: email, weight: weight, height: height
        }
        const responseNickname: QueryResult = await verifyNickname(clientQuery, nickname)
        if (responseNickname.rowCount !== 0) {
          responseMessage = singUpPageUserNotAvailable()
          userState = 'enterCredentialsSingUp'
          break;
        }
        const passwordHash = await encrypt(password)
        const response: QueryResult = await insertClientQuery(clientQuery, data, passwordHash)
        await insertClientDataQuery(clientQuery, response.rows[0].id, data)
        responseMessage = userCreatedSuccesfully()
        userState = 'start'
        break;
      } else {
        responseMessage = `Formato incorrecto, escribe "hola" para volver a comenzar`
      }
      break

    case 'enterCredentialsLogin':
      if (Body && Body.includes(' ')) {
        const [nickname, password] = Body.split(' ');
        userSession.setNickname(nickname)
        userSession.setPassword(password)
        const response: QueryResult = await verifyNickname(clientQuery, userSession.getNickname())
        if (!response.rowCount) {
          responseMessage = loginPageUserNotFound()
          userState = 'start'
          break;
        }

        userSession.setId(response.rows[0].id)
        const checkPassword = await compare(userSession.getPassword(), response.rows[0].password)
        if (!checkPassword) {
          responseMessage = loginPagePasswordIncorrect()
          userState = 'enterCredentialsLogin'
          break;
        }
        responseMessage = userLoginSuccesfully(nickname)
        userState = 'menu';
      } else {
        responseMessage = 'Formato incorrecto. Ingresa tu nickname y password separados por espacio.';
      }
      break;
    case 'menu':
      if (Body && Body.toLowerCase() === 'menu') {
        responseMessage = menuPage()
        userState = `selectOptionMenu`;
      } else {
        responseMessage = 'Opción no válida111. Por favor, selecciona una de las opciones disponibles.';
      }
      break;

    case `selectOptionMenu`:
      if (Body && Body === `1`) {
        responseMessage = menuPageCreateExercise()
        userState = `enterCredentialsCreateExercise`
      } else if (Body && Body === '2') {
        responseMessage = menuPageUpdateExercise()
        userState = `enterCredentialsUpdateExercise`
      } else if (Body && Body === '3') {
        responseMessage = menuPageDeleteExercise()
        userState = `enterCredentialsDeleteExercise`
      } else if (Body && Body === '4') {
        responseMessage =  await menuPageGetExercises(clientQuery, userSession.getId())
        break;
      } else if (Body && Body === '5') {
        responseMessage = menuPageGetExercisePerDay()
        userState = `enterCredentialsGetExercisePerDay`
      }
      break

    case 'enterCredentialsCreateExercise':
      if (Body && Body.includes(' ')) {
        const [day, name, series, reps, kg] = Body.split(' ');
        const seriesLength = parseInt(series, 10)
        const repsLength = reps.replace(/[{}]/g, '').split(',').map(Number);
        const data: ClientWorkout = { day, name, series, reps, kg };
        console.log(data.series, " ", data.reps.length)
        if (seriesLength !== repsLength.length) {
          responseMessage = 'La cantidad de series no coincide con la cantidad de repeticiones, vuelve a crear tu ejercicio';
          userState = 'enterCredentialsCreateExercise';
          break;
        }
        const response: QueryResult = await verifyNickname(clientQuery, userSession.getNickname());
        if (response.rowCount === 0) {
          responseMessage = 'Usuario no encontrado, vuelve al menú principal.';
          userState = 'menu';
          break;
        }
        await insertWorkoutQuery(clientQuery, response.rows[0].id, data);
        responseMessage = 'Ejercicio creado satisfactoriamente. Digita "menu" para volver al menú de usuario.';
        userState = 'menu';
      } else {
        responseMessage = 'Opción no válida. Por favor, vuelve a crear tu ejercicio.';
        userState = 'enterCredentialsCreateExercise';
      }
      break;
    case `enterCredentialsUpdateExercise`:
      if (Body && Body.includes(' ')) {
        const [day, name, series, reps, kg] = Body.split(' ')
        const data: ClientWorkout = { day: day, name: name, series: series, reps: reps, kg: kg }
        const verify: QueryResult = await verifyNickname(clientQuery, userSession.getNickname())
        if (data.reps.length !== series) {
          responseMessage = `La cantidad de series no coincide con la cantidad de repeticiones, vuelve a actualizar tu ejercicio`
          userState = `enterCredentialsUpdateExercise`
          break;
        }
        if (verify.rowCount === 0) {
          responseMessage = menuPageUserNotFound()
          userState = `menu`
          break;
        }
        const response: QueryResult = await withTimeout(getSingleWorkoutDataQuery(clientQuery, verify.rows[0].id, data))
        const dataUpdate: Partial<ClientWorkout> = {
          name: name ?? response.rows[0].name,
          day: day ?? response.rows[0].day,
          series: series ?? response.rows[0].series,
          reps: reps ?? response.rows[0].reps,
          kg: kg ?? response.rows[0].kg
        }
        await updateWorkoutData(clientQuery, verify.rows[0].id, dataUpdate)
        responseMessage = `Ejercicio actualizado satisfactoriamente, digita "menu" para volver al menu de usuario`
        userState = 'menu' // -------------> Acomodar esto por el bien comun (tener dos opciones, una para seguir, otra para ir al menu
      }
      else {
        responseMessage = `Opcion no valida.Por favor, vuelve a crear tu ejercicio`
        userState = `enterCredentialsUpdateExercise`
      }
      break;

    case `enterCredentialsDeleteExercise`:
      if (Body && Body.includes(' ')) {
        const [day, name, series, reps, kg] = Body.split(' ')
        const data: ClientWorkout = { day: day, name: name, series: series, reps: reps, kg: kg }
        const verify: QueryResult = await verifyNickname(clientQuery, userSession.getNickname())
        if (verify.rowCount === 0) {
          responseMessage = menuPageUserNotFound()
          userState = `menu`
          break;
        }
        await deleteWorkoutDataQuery(clientQuery, verify.rows[0].id, data)
        responseMessage = `Ejercicio eliminado satisfactoriamente, digita "menu" para volver al menu de usuario`
        userState = 'menu' // -------------> Acomodar esto por el bien comun (tener dos opciones, una para seguir, otra para ir al menu
      } else {
        responseMessage = `Opcion no valida.Por favor, vuelve a crear tu ejercicio`
        userState = `enterCredentialsDeleteExercise`
      }
      break;

    case 'enterCredentialsGetExercises':
      try {
        const verify: QueryResult = await verifyNickname(clientQuery, userSession.getNickname());
        const response: QueryResult = await getWorkoutAllDataQuery(clientQuery, verify.rows[0].id);
        if (response.rowCount === 0) {
          responseMessage = 'No se encontraron ejercicios. Vuelve al menú principal.';
          userState = 'menu';
          break;
        }
        const workoutData = response.rows.map(row => `Día: ${row.day}\n- Nombre: ${row.name}`).join('\n');
        responseMessage = `Ejercicios:\n${workoutData}`;
        userState = 'menu'; // Volvemos al menú principal después de mostrar los ejercicios
      } catch (error) {
        console.error('Error fetching exercises:', error);
        responseMessage = 'Hubo un error al obtener los ejercicios. Por favor, intenta nuevamente.';
        userState = 'menu';
      }
      break;
    default:
      responseMessage = 'Ocurrió un error en la aplicación. Por favor inténtalo más tarde.';
      break;
  }
  try {
    await client1.messages.create({
      body: responseMessage,
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+573165087855'
    });
    res.status(200).send({ success: true, message: responseMessage });
  } catch (error: any) {
    console.error('Error al enviar mensaje:', error);
    res.status(500).send({ success: false, error: error.message });
  }
});
export default router;
