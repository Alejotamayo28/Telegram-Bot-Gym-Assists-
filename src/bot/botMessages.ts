import { Markup } from "telegraf";
import { ClientLogin } from "../model/interface/client";
import { bot } from "../routes";

export const mainPage = () => {
  return `¡Bienvenido! 🌟 ¿Ya tienes una cuenta o te gustaría crear una?

- Para iniciar sesión, escribe: *1*  
- Para registrarte, escribe: *2*  

Ejemplos:

- Para iniciar sesión, escribe: *11*  
- Para crear una cuenta, escribe: *22*`
}

export const loginPage = () => {
  return `Por favor, ingresa tus credenciales para iniciar sesión en el siguiente formato:
      
  _nickname contraseña_`;
}

export const singUpPage = () => {
  return `Para registrarte, por favor proporciona la siguiente información en el formato indicado:

  _nickname contraseña nombre apellido edad género email peso altura_

Escribe *salir* para volver al menu.
`;
}

export const loginPageExample = () => {
  return `\n usuarioNickname usuarioPassword
      
Recuerda reemplazar los valores de ejemplo con tus credenciales personales.`
}

export const singUpPageExample = () => {
  return `Ejemplo para registrarte:
      
  _usuario2 contraseña2 Juan Pérez 25 masculino juan@example.com 70 175_
      
Recuerda reemplazar los valores de ejemplo con tu información personal. 
Escribe *hola* para comenzar de nuevo.`;
}

export const loginPageUserNotFound = () => {
  return `Usuario no encontrado. Por favor, escribe *hola* para crear una cuenta nueva.`;
}

export const loginPagePasswordIncorrect = () => {
  return `Contraseña incorrecta. Por favor, ingresa tu nickname y contraseña nuevamente.`;
}

export const singUpPageUserNotAvailable = () => {
  return `El nickname no está disponible. Por favor, ingresa tus datos nuevamente utilizando un nickname diferente.`;
}

export const userCreatedSuccesfully = () => {
  return `Usuario creado con éxito.
  
Escribe *name* para iniciar sesión.
`;
}

export const userLoginSuccesfully = (nickname: string) => {
  return `Inicio de sesión exitoso.

¡Bienvenido, _${nickname}_!

Escribe *menu* para acceder a tu menú de usuario.
`;
}

export const menuPage = () => {
  return `¡Hola! 🌟 Este es tu menú de usuario:
- Para crear un ejercicio, escribe: *1*
- Para actualizar un ejercicio, escribe: *2*
- Para eliminar un ejercicio, escribe: *3*
- Para obtener todos los ejercicios, escribe: *4*
- Para obtener ejercicios por día, escribe: *5*

Ejemplos:
- Para crear un ejercicio, escribe: *11*
- Para actualizar un ejercicio, escribe: *22*
- Para eliminar un ejercicio, escribe: *33*
- Para obtener todos los ejercicios, escribe: *44*
- Para obtener ejercicios por día, escribe: *55*`;
}

export const menuPageUserNotFound = () => {
  return `Nickname no encontrado. Por favor, escribe *menu* para volver a tu menú de usuario.`;
}

export const menuPageCreateExercise = () => {
  return `Para crear un ejercicio, por favor proporciona la siguiente información:

_day name series {rep1, rep2, rep3} kg_
`;
}

export const menuPageCreateExerciseExample = () => {
  return `Ejemplo para crear tu ejercicio:

_lunes press_plano 3 {10,9,6} 10_

Recuerda reemplazar los valores de ejemplo con los datos de tu ejercicio.
Escribe *menu* para volver a tu menú de usuario.`;
}

export const menuPageUpdateExercise = () => {
  return `Para actualizar un ejercicio, por favor proporciona la siguiente información:

_day name series {rep1, rep2, rep3} kg_
`;
}

export const menuPageUpdateExerciseExample = () => {
  return `Ejemplo para actualizar tu ejercicio: 

_lunes press_plano 3 {10,10,10} 100_

Recuerda reemplazar los valores de ejemplo con los datos de tu ejercicio.
Escribe *menu* para volver a tu menu de usuarios.`;
}

export const menuPageDeleteExercise = () => {
  return `Para eliminar un ejercicio, por favor proporciona la siguiente información:

_day exercise_name_
`;
}

export const menuPageGetExercisePerDay = () => {
  return `Para obtener los ejercicios de un día específico, por favor proporciona la siguiente información:

_day_
`;
}

export class UserSession {
  private userData: ClientLogin
  private id: number
  constructor() {
    this.userData = {
      nickname: ' ',
      password: ' ',
    }
    this.id = 0
  }
  setNickname(nickname: string) {

    if (typeof nickname === 'string' && nickname.trim() !== '') {
      this.userData.nickname = nickname.trim();
    } else {
      throw new Error('Nickname inválido');
    }
  }
  getNickname() {
    return this.userData.nickname;
  }
  setPassword(password: string) {
    if (typeof password === 'string' && password.trim() !== '') {
      this.userData.password = password.trim();
    } else {
      throw new Error('Contraseña inválida');
    }
  }
  getPassword() {
    return this.userData.password;
  }
  setId(id: number) {
    this.id = id
  }
  getId() {
    return this.id
  }
  getDataLogin() {
    return this.userData
  }
  clear() {
    this.userData.nickname = '';
    this.userData.password = '';
  }
}

export const sendMainMenu = async (ctx: any) => {
  return await ctx.reply(`¡Hola! Bienvenido a nuestro Asesor Virtual de entrenamiento y acondicionamiento físico.\n
Actualmente, estoy en la versión beta y planeo agregar mas funciones nuevas en el futuro. ¡Gracias por probarlo!\n
Por favor, selecciona una de las siguientes opciones para continuar:`, Markup.inlineKeyboard([
    Markup.button.callback('Iniciar sesión', 'option_login'),
    Markup.button.callback('Crear cuenta', 'option_signUp'),
  ])),
    await ctx.reply(`Si necesitas ayuda para iniciar sesión o crear una cuenta, selecciona una de las siguientes opciones:`,
      Markup.inlineKeyboard([
        Markup.button.callback('Guia para inicar session', 'option_guide_login'),
        Markup.button.callback('Ejemplo crear cuenta', 'option_guide_signUp')
      ]));
}

export const sendMainMenuOptions = async (ctx: any) => {
  return await ctx.reply(`Sigue explorando y utilizando las demas funciones de nuestro asistente virutal: \n`, Markup.inlineKeyboard([
    [Markup.button.callback('Iniciar sesión', 'option_login'), Markup.button.callback('Crear cuenta', 'option_signUp')],
    [Markup.button.callback('Guia para inicar session', 'option_guide_login'), Markup.button.callback('Ejemplo crear cuenta', 'option_guide_signUp')]
    ,])
  )
}

export const sendMenu = async (ctx: any) => {
  return ctx.reply(`¡Hola! Bienvenido al menú de usuario.

En este menú encontrarás varias funciones que pueden ajustarse a tus necesidades. Siéntete libre de explorar y utilizar todas las opciones disponibles.

Actualmente, estamos en la versión beta, y planeo agregar muchas más funciones en el futuro. ¡Gracias por probarlo!`,
    Markup.inlineKeyboard([
      [Markup.button.callback('Agregar ejercicio', 'menu_post_exercise'), Markup.button.callback('Actualizar ejercicio', 'menu_put_exercise')],
      [Markup.button.callback('Obtener ejercicio por día', 'menu_get_exercise_day'), Markup.button.callback('Obtener ejercicios semanales', 'menu_get_exercise')],
      [Markup.button.callback('Eliminar ejercicio', 'menu_delete_exercise')],
      [Markup.button.callback(`Guia ejercicios`, `menu_api`)]
    ])
  );
};

export const sendMenuOptions = async (ctx: any) => {
  return ctx.reply(`Sigue explorando y utilizando las demas funciones de nuestro asistente virutal: \n`,
    Markup.inlineKeyboard([
      [Markup.button.callback('Agregar ejercicio', 'menu_post_exercise'), Markup.button.callback('Actualizar ejercicio', 'menu_put_exercise')],
      [Markup.button.callback('Obtener ejercicio por día', 'menu_get_exercise_day'), Markup.button.callback('Obtener ejercicios semanales', 'menu_get_exercise')],
      [Markup.button.callback('Eliminar ejercicio', 'menu_delete_exercise')],
      [Markup.button.callback(`Guia ejercicios`, `menu_api`)],
    ])
  );
};


export const sendMenupApi = async (ctx: any) => {
  return ctx.reply(`Por favor, escoge la parte del cuerpo la cual deseas trabajar: \n`,
    Markup.inlineKeyboard([
      [Markup.button.callback(`Brazo`, `menu_api_brazo`), Markup.button.callback(`Pecho`, `menu_api_pecho`), Markup.button.callback(`Espalda`, `menu_api_espalda`)],
      [Markup.button.callback(`Pierna`, `menu_api_pierna`)]
    ])
  )
}

export const menuApiBrazo = async (ctx: any) => {
  return ctx.reply(`Por favor, escoge la parte especifica del brazo que deseas trabajar: \n`,
    Markup.inlineKeyboard([
      [Markup.button.callback(`Hombro`, `menuApiBrazo_hombro`), Markup.button.callback(`Biscep`, `menuApiBrazo_biscep`),
      Markup.button.callback(`Triscep`, `menuApiBrazo_triscep`)]
    ])
  )
}


export const menuApiBrazo_hombro = async (ctx: any) => {
  return ctx.reply(
    `Aquí tienes algunos ejercicios para hombro que puedes realizar:

1. Press Militar: 
   - Descripción: Este ejercicio trabaja los deltoides y el trapecio.
   - Instrucciones: Siéntate en un banco con respaldo y sujeta una barra con las manos a la altura de los hombros. Empuja la barra hacia arriba hasta que tus brazos estén completamente extendidos. Luego, bájala de nuevo a la posición inicial.

2. Elevaciones Laterales:
   - Descripción: Este ejercicio se enfoca en los deltoides laterales.
   - Instrucciones: De pie, con una mancuerna en cada mano, levanta los brazos hacia los lados hasta que estén a la altura de los hombros, luego baja lentamente.

3. Pájaros (Rear Delt Fly):
   - Descripción: Trabaja los deltoides traseros.
   - Instrucciones: Inclínate hacia adelante con una mancuerna en cada mano y los brazos colgando. Levanta los brazos hacia los lados manteniendo un ligero doblez en los codos, luego baja lentamente.

Si necesitas más información o una demostración en video, puedes hacer clic en los botones a continuación:`,
    Markup.inlineKeyboard([
      [Markup.button.url('Press Militar - Video', 'https://www.youtube.com/watch?v=UyJmEYDa7Kk')],
      [Markup.button.url('Elevaciones Laterales - Video', 'https://www.youtube.com/watch?v=qEwKCR5JCog')],
      [Markup.button.url('Pájaros - Video', 'https://www.youtube.com/watch?v=pMTd4_jRg5k')],
      [Markup.button.callback(`Menu ejercicios`, `menu_api`), Markup.button.callback(`Menu principal`, `menu_principal`)],
    ])
  );
}


export const menuApiBrazo_Biscep = async (ctx: any) => {
  return ctx.reply(
    `Aqui tienes algunos ejercicios para el biscep que puedes realizar:

1. Curl predicador:
   - Descripcion: Este ejercicio trabaja el biscep en su posicion mas corta.
   - Instrucciones: Siéntate en un banco predicador y sujeta una barra con las manos separadas al ancho de los hombros. Levanta la barra hacia tus hombros contrayendo los bíceps y luego bájala lentamente a la posición inicial.

2. Curl Inclinado:
   - Descripción: Este ejercicio se enfoca en la parte larga del bíceps, estirándola más en la posición inicial.
   - Instrucciones: Siéntate en un banco inclinado con una mancuerna en cada mano y las palmas hacia arriba. Levanta las mancuernas hacia tus hombros contrayendo los bíceps y luego bájalas lentamente

3. Curl Martillo:
   - Descripción: Trabaja el braquiorradial y los bíceps desde un ángulo diferente.
   - Instrucciones: De pie, sujeta una mancuerna en cada mano con las palmas hacia el cuerpo. Levanta ambas mancuernas hacia tus hombros manteniendo las palmas enfrentadas y luego bájalas lentamente.

Si necesitas más información o una demostración en video, puedes hacer clic en los botones a continuación:`,
    Markup.inlineKeyboard([
      [Markup.button.url('Curl Predicador - Video', 'https://www.youtube.com/watch?v=-Vyt2QdsR7E')],
      [Markup.button.url('Curl Inclinado - Video', 'https://www.youtube.com/watch?v=soxrZlIl35U')],
      [Markup.button.url('Curl Martillo - Video', 'https://www.youtube.com/watch?v=zC3nLlEvin4')],
      [Markup.button.callback(`Menu ejercicios`, `menu_api`), Markup.button.callback(`Menu principal`, `menu_principal`)],
    ])
  )
}

export const menuApiBrazo_triscep = async (ctx: any) => {
  return ctx.reply(
    `Aqui tienes algunos ejercicios para el triscep que puedes realizaar: 

1. Extensiones sobre nuca:
   - Descripcion: Este ejercicio trabaja el tricep, principalmente su cabeza lateral.
   - Instrucciones: De pie, sujeta la barra con ambas manos detras de la cabeza. Extiende los codos para levantar la barra hacia arriba y luego baja lentamente.

2. Pushdowns:
   - Descripcion: Este ejercicio trabaja el tricep, principalmente su cabeza larga.
   - Instrucciones: De pie, sujeta una cuerda o barra con ambas manos y presiona hacia abajo extendiendo los codos. Luego vuelve levementa a la posicion  inicial.

3. Extensiones unilaterales:
   - Descripcion: Trabaja el tricep de manera unilateral para mejorar el equilibrio muscular.
   - Instrucciones: De pie, sujeta una mancuerna con una mano y extiende el codo para levantar la mancuerna hacia arriba. Baja lentamente y repite con el otro brazo.

Si necesitas informacion o una demostracion en video, puedes hacer clic en los botones a continuacion: `,
    Markup.inlineKeyboard([
      [Markup.button.url('Extensiones Tras Nuca \- Video', 'https://www.youtube.com/watch?v=5JDBQPr1dNs')],
      [Markup.button.url('Pushdowns \- Video', 'https://www.youtube.com/watch?v=J5ziyiTdc8o')],
      [Markup.button.url('Extensiones Unilaterales \- Video', 'https://www.youtube.com/watch?v=sQrVvTt5PbE')],
      [Markup.button.callback(`Menu ejercicios`, `menu_api`), Markup.button.callback(`Menu principal`, `menu_principal`)]
    ])
  )
}
