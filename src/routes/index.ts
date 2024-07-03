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
import { deleteWorkoutDataQuery, getSingleWorkoutDataQuery, getWorkoutAllDataQuery, getWorkoutDataPerDay, insertWorkoutQuery, updateWorkoutData } from '../queries/workoutQueries';
import { UserSession, loginPage, loginPageExample, loginPagePasswordIncorrect, loginPageUserNotFound, mainPage, menuPage, menuPageCreateExercise, menuPageCreateExerciseExample, menuPageDeleteExercise, menuPageGetExercisePerDay, menuPageUpdateExercise, menuPageUpdateExerciseExample, singUpPage, singUpPageExample, singUpPageUserNotAvailable, userCreatedSuccesfully, userLoginSuccesfully } from '../bot/botMessages';
import { menuPageGetExercises } from '../bot/botFuntions';
import { Telegraf, Context, Markup } from 'telegraf'
import { enterCredentialsMessages } from '../whatsApp/enterCredentialsMessages';


const router = Router();
dotenv.config()

const token = process.env.TELEGRAM_TOKEN
export const bot = new Telegraf(token!)

let userState: { [key: number]: string } = {};
const userSession = new UserSession()

bot.start((ctx) => {
  ctx.reply('¡Hola! Por favor, escribe "Hola" para comenzar.', Markup.inlineKeyboard([
    Markup.button.callback('Option 1', 'option_1')
  ]));
  userState[ctx.from.id] = 'start';
});





bot.action('option_1', (ctx) => ctx.reply(`You option 1`))

bot.on("text", async (ctx) => {

  const userId = ctx.from.id;
  const text: any = ctx.message.text;
  const clientQuery = await pool.connect()
  let responseMessage = '';

  switch (userState[userId]) {
    case 'start':
      if (text && text.toLowerCase() === 'hola') {
        responseMessage = mainPage();
        userState[userId] = 'selectOption';
      } else {
        responseMessage = 'No he entendido ese comando. Por favor, escribe "Hola" para comenzar.';
      }
      break;

    case `selectOption`:
      if (text && text === '1') {
        responseMessage = loginPage()
        userState[userId] = `enterCredentialsLogin`
      } else if (text && text === '2') {
        responseMessage = singUpPage();
        userState[userId] = 'enterCredentialsSingUp';
      } else if (text && text === '11') {
        responseMessage = loginPageExample();
        userState[userId] = 'start';
      } else if (text && text === '22') {
        responseMessage = singUpPageExample()
        userState[userId] = 'start';
      }
      else {
        responseMessage = `No he entendido ese comando.Por favor, escribe una de las opciones`
      }
      break
    case 'enterCredentialsLogin':
      if (text && text.toLowerCase() === "salir") {
        responseMessage = mainPage()
        userState[userId] = `selectOption`
        break
      }
      if (text && text.includes(' ')) {
        const [nickname, password] = text.split(' ');
        userSession.setNickname(nickname)
        userSession.setPassword(password)
        const response: QueryResult = await verifyNickname(clientQuery, userSession.getNickname())
        if (!response.rowCount) {
          responseMessage = loginPageUserNotFound()
          userState[userId] = 'start'
          break;
        }
        userSession.setId(response.rows[0].id)
        const checkPassword = await compare(userSession.getPassword(), response.rows[0].password)
        if (!checkPassword) {
          responseMessage = loginPagePasswordIncorrect()
          userState[userId] = 'enterCredentialsLogin'
          break;
        }
        responseMessage = userLoginSuccesfully(nickname)
        userState[userId] = 'menu';
      } else {
        responseMessage = 'Formato incorrecto. Ingresa tu nickname y password separados por espacio.';
      }
      break;

    case 'enterCredentialsSingUp':
      if (text && text.toLowerCase() === "salir") {
        responseMessage = mainPage()
        userState[userId] = `selectOption`
        break
      }
      if (text && text.includes(' ')) {
        const [nickname, password, first_name, last_name, age, gender, email, weight, height] = text.split(' ')
        const data: ClientData = {
          nickname: nickname, password: password, first_name: first_name, last_name: last_name,
          age: age, gender: gender, email: email, weight: weight, height: height
        }
        const responseNickname: QueryResult = await verifyNickname(clientQuery, nickname)
        if (responseNickname.rowCount !== 0) {
          responseMessage = singUpPageUserNotAvailable()
          userState[userId] = 'enterCredentialsSingUp'
          break;
        }
        const passwordHash = await encrypt(password)
        const response: QueryResult = await insertClientQuery(clientQuery, data, passwordHash)
        await insertClientDataQuery(clientQuery, response.rows[0].id, data)
        responseMessage = userCreatedSuccesfully()
        userState[userId] = 'start'
        break;
      } else {
        responseMessage = `Formato incorrecto, escribe "hola" para volver a comenzar`
      }
      break
    case 'menu':
      if (text && text.toLowerCase() === 'menu') {
        responseMessage = menuPage()
        userState[userId] = `selectOptionMenu`;
      } else {
        responseMessage = 'Opción no válida111. Por favor, selecciona una de las opciones disponibles.';
      }
      break;

    case `selectOptionMenu`:
      if (text && text === `1`) {
        responseMessage = menuPageCreateExercise()
        userState[userId] = `enterCredentialsCreateExercise`
      } else if (text && text === '2') {
        responseMessage = menuPageUpdateExercise()
        userState[userId] = `enterCredentialsUpdateExercise`
      } else if (text && text === '3') {
        responseMessage = menuPageDeleteExercise()
        userState[userId] = `enterCredentialsDeleteExercise`
      } else if (text && text === '4') {
        responseMessage = await menuPageGetExercises(clientQuery, userSession.getId())
        userState[userId] = 'menu'
      } else if (text && text === '5') {
        responseMessage = menuPageGetExercisePerDay()
        userState[userId] = `enterCredentialsGetExercisePerDay`
      } else if (text && text === '11') {
        responseMessage = menuPageCreateExerciseExample()
        userState[userId] = 'menu'
      } else if (text && text === '22') {
        responseMessage = menuPageUpdateExerciseExample()
        userState[userId] = 'menu'
      }
      break

    case 'enterCredentialsCreateExercise':
      if (text && text.includes(' ')) {
        const [day, name, series, reps, kg] = text.split(' ');
        const seriesLength = parseInt(series, 10)
        const repsLength = reps.replace(/[{}]/g, '').split(',').map(Number);
        const data: ClientWorkout = { day, name, series, reps, kg };
        console.log(data.series, " ", data.reps.length)
        if (seriesLength !== repsLength.length) {
          responseMessage = enterCredentialsMessages.createWrong();
          userState[userId] = 'enterCredentialsCreateExercise';
          break;
        }
        await insertWorkoutQuery(clientQuery, userSession.getId(), data);
        responseMessage = enterCredentialsMessages.CreatSuccesfull();
        userState[userId] = 'menu';
      } else {
        responseMessage = 'Opción no válida. Por favor, vuelve a crear tu ejercicio.';
        userState[userId] = 'enterCredentialsCreateExercise';
      }
      break;
    case `enterCredentialsUpdateExercise`:
      if (text && text.includes(' ')) {
        const [day, name, series, reps, kg] = text.split(' ')
        const data: ClientWorkout = { day: day, name: name, series: series, reps: reps, kg: kg }
        if (data.reps.length !== series) {
          responseMessage = enterCredentialsMessages.UpdateWrong()
          userState[userId] = `enterCredentialsUpdateExercise`
          break;
        }
        const response: QueryResult = await withTimeout(getSingleWorkoutDataQuery(clientQuery, userSession.getId(), data))
        const dataUpdate: Partial<ClientWorkout> = {
          name: name ?? response.rows[0].name,
          day: day ?? response.rows[0].day,
          series: series ?? response.rows[0].series,
          reps: reps ?? response.rows[0].reps,
          kg: kg ?? response.rows[0].kg
        }
        await updateWorkoutData(clientQuery, userSession.getId(), dataUpdate)
        responseMessage = enterCredentialsMessages.UpdateSuccesfull()
        userState[userId] = 'menu' // -------------> Acomodar esto por el bien comun (tener dos opciones, una para seguir, otra para ir al menu
      }
      else {
        responseMessage = `Opcion no valida.Por favor, vuelve a crear tu ejercicio`
        userState[userId] = `enterCredentialsUpdateExercise`
      }
      break;

    case `enterCredentialsDeleteExercise`:
      if (text && text.includes(' ')) {
        const [day, name, series, reps, kg] = text.split(' ')
        const data: ClientWorkout = { day: day, name: name, series: series, reps: reps, kg: kg }
        await deleteWorkoutDataQuery(clientQuery, userSession.getId(), data)
        responseMessage = `Ejercicio eliminado satisfactoriamente, digita "menu" para volver al menu de usuario`
        userState[userId] = 'menu' // -------------> Acomodar esto por el bien comun (tener dos opciones, una para seguir, otra para ir al menu
      } else {
        responseMessage = `Opcion no valida.Por favor, vuelve a crear tu ejercicio`
        userState[userId] = `enterCredentialsDeleteExercise`
      }
      break;
    case `enterCredentialsGetExercisePerDay`:
      if (text) {
        const day = text.trim()
        const response: QueryResult = await getWorkoutDataPerDay(clientQuery, userSession.getId(), day)
        if (response.rowCount === 0) {
          responseMessage = `No se encontraron ejercicios del dia ${ day }.\n
Escribe * menu * para volver a tu menu de usuario.`
          userState[userId] = 'menu'
          break;
        }
        const data = response.rows.map(row =>
          `- Nombre: ${ row.name }, series: ${ row.series }, repeticiones: { ${ row.reps } }, peso: ${ row.kg }.`
        ).join('\n');
        responseMessage = `Ejercicios del _${ day } _: ` + '\n' + data + `\n` + `\n` + `Escribe * menu * para volver a tu menu de usuario.`
        userState[userId] = 'menu,'
        break;
      }
    default:
      responseMessage = 'Ocurrió un error en la aplicación. Por favor vuelve a escribir */start* dentro de unos momentos. menu';
      userState[userId] = 'menu'
      break;
  }

  ctx.reply(responseMessage);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));









export default router;
