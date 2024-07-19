import { compare } from "bcryptjs";
import { QueryResult } from "pg";
import { bot } from "../bot";
import { pool } from "../database/database";
import { encrypt } from "../middlewares/jsonWebToken/enCryptHelper";
import { userState, userSession } from "../userState";
import { sendMenu, sendMenuOptions } from "./actions/menu";
import { sendMainMenuOptions } from "./actions/start";
import { buttonLogin } from "./guideExercises/inlineButtons.ts/buttons";


bot.on('text', async (ctx) => {
  const client = await pool.connect();
  const userId = ctx.from.id;
  const userMessage = ctx.message.text;
  try {
    if (userState[userId]) {
      switch (userState[userId].stage) {
        case 'signUp_nickname':
          console.log('oadjoas')
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
            buttonLogin)
          break;


        case 'login_nickname':
          const response: QueryResult = await client.query(`SELECT * FROM client WHERE nickname = $1`, [userMessage])
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
          const responseGet_day: QueryResult = await client.query(`SELECT * FROM workout WHERE id = $1 AND day = $2`, [userId, userState[userId].day])
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
