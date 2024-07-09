import { Router } from 'express';
import { QueryResult } from 'pg';
import { pool } from '../database/database';
import { compare } from 'bcryptjs';
import { encrypt } from '../middlewares/jsonWebToken/enCryptHelper';
import { UserData } from '../model/interface/client';
import { verifyNickname } from '../queries/clientQueries';
import { ClientWorkout } from '../model/interface/workout';
import { getWorkoutDataPerDay } from '../queries/workoutQueries';
import { UserSession } from '../bot/botMessages';
import { Telegraf, Markup } from 'telegraf'
import { menuPageGetExercises } from '../bot/botFuntions';
import { sendMainMenu, sendMainMenuOptions } from '../bot/messages/menu/loginSingUp';
import { sendMenu, sendMenuOptions, sendMenupApi } from '../bot/messages/menu/mainMenu';
import { menuBrazo, menuBrazo_Biscep, menuBrazo_Triscep, menuBrazo_hombro } from '../bot/guide/arm/armMenu';
import { curlAlternado, curlInclinado, curlMartillo, curlPredicador, fondos, pressFrances, pushdowns } from '../bot/guide/arm/armExercises';
import { menuPecho, menuPecho_Superior, menuPecho_completo, menuPecho_inferior } from '../bot/guide/chest/chestMenu';
import { declinadoBarra, declinadoMancuernas, declinadoSmith, inclinadoBarra, inclinadoMancuernas, inclinadoSmith, pressPlano, pressPlano_mancuernas } from '../bot/guide/chest/chestExercises';
import { userState, userSession } from '../userState';
import { bot } from '../bot';

const router = Router();


bot.start(async (ctx) => {
  await sendMainMenu(ctx)
});



bot.action('option_login', async (ctx) => {
  await ctx.reply(`Por favor, digita tu nickname: `)
  userState[ctx.from.id] = { stage: 'login_nickname' }
});
bot.action('option_signUp', async (ctx) => {
  await ctx.reply(`Por favor, proporciona tu nickname con el cual te gustaria entrar en la aplicacion `)
  userState[ctx.from.id] = { stage: 'signUp_nickname' }
})
bot.action(`option_guide_login`, async (ctx) => {
  await ctx.reply(`Al hacer click en el boton "Iniciar session", se te haran dos preguntas sobre tu cuenta. Por favor, lee cada pregunta cuidadosamente`)
  await sendMainMenuOptions(ctx)
})
bot.action(`option_guide_signUp`, async (ctx) => {
  await ctx.reply(`Al hacer clic en el botón "Crear cuenta", se te harán algunas preguntas sobre tu información personal. Por favor, lee cada pregunta cuidadosamente y responde de manera responsable. 
Tus datos serán almacenados en una base de datos segura. Solo tu "nickname" y "email" serán visibles, mientras que tu contraseña estará encriptada para proteger tu privacidad. ¡Gracias por tu cooperación!`)
  await sendMainMenuOptions(ctx)
})


bot.action(`menu_post_exercise`, async (ctx) => {
  await ctx.reply(`Por favor, digita el dia en el cual realizas el  ejercicio `)
  userState[ctx.from.id] = { stage: 'menu_post_exercise_day' }
})
bot.action(`menu_put_exercise`, async (ctx) => {
  await ctx.reply(`Por favor, digita el dia en donde realizaste el ejercicio a actualizar `)
  userState[ctx.from.id] = { stage: 'menu_put_exercise_day' }
})
bot.action('menu_get_exercise_day', async (ctx) => {
  await ctx.reply(`Por favor, digita el dia para buscar tus ejercicios: `)
  userState[ctx.from.id] = { stage: 'menu_get_weekly' }
})
bot.action(`menu_get_exercise`, async (ctx) => {
  await ctx.reply(await menuPageGetExercises(await pool.connect(), ctx.from.id))
  await sendMenuOptions(ctx)
})
bot.action(`menu_delete_exercise`, async (ctx) => {
  await ctx.reply(`Por favor, digita el dia en donde realizaste el ejercicio a eliminar`)
  userState[ctx.from.id] = { stage: 'menu_delete_exercise_day' }
})

bot.action(`menuExercises`, async (ctx) => {
  await sendMenupApi(ctx)
})

bot.action(`menu_principal`, async (ctx) => {
  await sendMenuOptions(ctx)
})

// BRAZO OPCIONES EJERCICIOS
bot.action(`Brazo`, async (ctx) => {
  await menuBrazo(ctx)
})
//BISCEP 
bot.action(`menuBrazo_biscep`, async (ctx) => {
  await menuBrazo_Biscep(ctx)
})
bot.action(`curl_martillo`, async (ctx) => {
  await curlMartillo(ctx)
})
bot.action(`curl_predicador`, async (ctx) => {
  await curlPredicador(ctx)
})
bot.action(`curl_alternado`, async (ctx) => {
  await curlAlternado(ctx)
})
bot.action(`curl_inclinado`, async (ctx) => {
  await curlInclinado(ctx)
})
//Tricep
bot.action(`menuBrazo_triscep`, async (ctx) => {
  await menuBrazo_Triscep(ctx)
})

bot.action(`fondos`, async (ctx) => {
  await fondos(ctx)
})
bot.action(`pushdowns`, async (ctx) => {
  await pushdowns(ctx)
})
//HOMBRO
bot.action(`menuBrazo_hombro`, async (ctx) => {
  await menuBrazo_hombro(ctx)
})





// EJERCICIOS PECHO --->

bot.action(`Pecho`, async (ctx) => {
  await menuPecho(ctx)
})
//PECHO SUPERIOR
bot.action(`menuPecho_superior`, async (ctx) => {
  await menuPecho_Superior(ctx)
})
bot.action(`inclinado_mancuernas`, async (ctx) => {
  await inclinadoMancuernas(ctx)
})
bot.action(`inclinado_smith`, async (ctx) => {
  await inclinadoSmith(ctx)
})
bot.action(`inclinado_barra`, async (ctx) => {
  await inclinadoBarra(ctx)
})
//PECHO INFERIOR
bot.action(`menuPecho_inferior`, async (ctx) => {
  await menuPecho_inferior(ctx)
})
bot.action(`declinado_mancuernas`, async (ctx) => {
  await declinadoMancuernas(ctx)
})
bot.action(`declinado_smith`, async (ctx) => {
  await declinadoSmith(ctx)
})
bot.action(`decliando_barra`, async (ctx) => {
  await declinadoBarra(ctx)
})
//PECHO COMPLETO
bot.action(`menuPecho_completo`, async (ctx) => {
  await menuPecho_completo(ctx)
})
bot.action(`press_plano`, async (ctx) => {
  await pressPlano(ctx)
})
bot.action(`press_plano_mancuernas`, async (ctx) => {
  await pressPlano_mancuernas(ctx)
})


bot.on('text', async (ctx) => {
  const client = await pool.connect();
  const userId = ctx.from.id;
  const userMessage = ctx.message.text;
  try {
    if (userState[userId]) {
      switch (userState[userId].stage) {
        case 'signUp_nickname':
          userState[userId].nickname = userMessage.toLowerCase();
          const verifySingUp: QueryResult = await client.query(`SELECT * FROM client WHERE nickname = $1`,
            [userState[userId].nickname])
          if (verifySingUp.rowCount) {
            await ctx.reply(`Usuario no disponible, inicia session, o vuelve a escribir tu nickname!`)
            await sendMainMenuOptions(ctx)
            break;
          }
          userState[userId].stage = 'signUp_password';
          await ctx.reply('Por favor, proporciona tu contraseña con la cual te gustaría entrar en la aplicación');
          break;

        case 'signUp_password':
          userState[userId].password = userMessage.toLowerCase();
          userState[userId].stage = 'signUp_email';
          await ctx.reply('Por favor, proporciona tu correo electrónico');
          break;

        case 'signUp_email':
          userState[userId].email = userMessage;
          userState[userId].stage = 'signUp_done';
          const passwordHash = await encrypt(userState[userId].password);
          await client.query(
            `INSERT INTO client (id, nickname, password, email) VALUES ($1, $2, $3, $4)`,
            [userId, userState[userId].nickname, passwordHash, userState[userId].email]
          );
          delete userState[userId]
          await ctx.reply(`Gracias por haber creado tu cuenta.\nAhora, por favor inicia seccion para continuar `,
            Markup.inlineKeyboard([Markup.button.callback(`Inicar seccion`, `option_login`)]))
          break;


        case 'login_nickname':
          const response: QueryResult = await verifyNickname(client, userMessage)
          if (!response.rowCount) {
            await ctx.reply(`Usuario no encontrado, vuelve a escribir tu nickname`)
            userState[userId].stage = 'login_nickname'
            break;
          } else
            userSession.setNickname(response.rows[0].nickname)
          userSession.setPassword(response.rows[0].password)

          userState[userId].stage = 'login_password'
          ctx.reply(`Por favor, proporciona tu contrasena`)
          break

        case 'login_password':
          if (!(await compare(userMessage, userSession.getPassword()))) {
            ctx.reply(`contrasena incorrecta`)
          } else
            await sendMenu(ctx)
          break



        case `menu_post_exercise_day`:
          userState[userId].day = userMessage.toLowerCase()
          await ctx.reply(`Por favor, digita el nombre del ejercicio `)
          userState[userId].stage = 'menu_post_exercise_name'
          break
        case `menu_post_exercise_name`:
          userState[userId].name = userMessage.toLowerCase()
          await ctx.reply(`Por favor, digita la cantidad de repeticiones que realizaste (por medio de espacios) `)
          userState[userId].stage = 'menu_post_exercise_reps'
          break
        case `menu_post_exercise_reps`:
          const str = userMessage
          const reps = str.split(" ").map(Number)
          userState[userId].reps = reps
          await ctx.reply(`Por favor, digita el peso en kg con el cual realizaste el ejercicio`)
          userState[userId].stage = `menu_post_exercise_peso`
          break
        case `menu_post_exercise_peso`:
          userState[userId].kg = userMessage
          await client.query(`INSERT INTO workout (id, day, name, reps, kg) VALUES ($1, $2, $3, $4, $5)`,
            [userId, userState[userId].day, userState[userId].name, userState[userId].reps, userState[userId].kg])
          await ctx.reply(`Ejercicio creado con exito! \n`)
          delete userState[userId]
          await sendMenuOptions(ctx)
          break



        case 'menu_put_exercise_day':
          userState[userId].day = userMessage.toLowerCase()
          ctx.reply(`Por favor, digita el nombre del ejercicio a actualizar `)
          userState[userId].stage = 'menu_put_exercise_name'
          break
        case 'menu_put_exercise_name':
          userState[userId].name = userMessage.toLowerCase()
          const exits: QueryResult = await client.query(`SELECT * FROM workout WHERE id = $1 AND day = $2 AND name = $3`,
            [userId, userState[userId].day, userState[userId].name])
          if (!exits.rowCount) {
            await ctx.reply(`El ejercicio no se encuentra en la base de datos, crealo!`)
            await sendMenuOptions(ctx)
            break
          }
          ctx.reply(`Por favor, digita las repiticiones nuevas del ejercicio (por medio de espacios) `)
          userState[userId].stage = 'menu_put_exercise_reps'
          break
        case 'menu_put_exercise_reps':
          const repsUpdate = userMessage.split(" ").map(Number)
          userState[userId].reps = repsUpdate
          ctx.reply(`Por favor, digita el nuevo peso : `)
          userState[userId].stage = 'menu_put_exercise_weight'
          break
        case 'menu_put_exercise_weight':
          userState[userId].kg = userMessage
          const user = userState[userId]
          await client.query(`UPDATE workout SET  reps = $1, kg = $2 WHERE id = $3 AND day = $4 AND name = $5`,
            [user.reps, user.kg, userId, user.day, user.name])
          await ctx.reply(`Ejercicio actualizado con exito!`)
          await sendMenuOptions(ctx)
          break


        case 'menu_get_weekly':
          userState[userId].day = userMessage.toLowerCase()
          const responseGet_day: QueryResult = await getWorkoutDataPerDay(client, userId, userState[userId].day)
          if (!responseGet_day.rowCount) {
            await ctx.reply(`No se encontraron ejercicios del dia ${userMessage}`)
            await sendMenuOptions(ctx)
            break;
          }
          const data = responseGet_day.rows.map(row =>
            `- ${row.name} || reps: ${row.reps} || peso: ${row.kg}\n`).join('\n')
          await ctx.reply(`Ejercicios del ${userState[userId].day}: \n${data}`)
          await sendMenuOptions(ctx)
          break



        case 'menu_delete_exercise_day':
          userState[userId].day = userMessage.toLowerCase()
          await ctx.reply(`Por favor, digita el nombre del ejercicio a eliminar`)
          userState[userId].stage = 'menu_delete_exercise_name'
          break

        case 'menu_delete_exercise_name':
          userState[userId].name = userMessage.toLowerCase()
          await client.query(`DELETE FROM workout WHERE name = $1 AND day = $2 AND id = $3`,
            [userState[userId].name, userState[userId].day, userId])
          await ctx.reply(`Ejercicio eliminado con exito!`)
          await sendMenuOptions(ctx)
          break;


        default:
          ctx.reply('Por favor, selecciona una opción válida para continuar.');
          break;
      }
    }
  } catch (error) {
    console.error('Error handling user message:', error);
    ctx.reply('Ha ocurrido un error. Por favor, intenta nuevamente más tarde.');
  } finally {
    client.release();
  }
});







export default router
