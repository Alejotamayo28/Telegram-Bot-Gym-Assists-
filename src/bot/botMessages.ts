import { ClientLogin } from "../model/interface/client";

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
      
  _nickname contraseña_

Escribe *salir* para volver al menu.
`;
}

export const singUpPage = () => {
  return `Para registrarte, por favor proporciona la siguiente información en el formato indicado:

  _nickname contraseña nombre apellido edad género email peso altura_

Escribe *salir* para volver al menu.
`;
}

export const loginPageExample = () => {
  return `Ejemplo para iniciar sesión:
      
  _usuario1 contraseña1_
      
Recuerda reemplazar los valores de ejemplo con tus credenciales personales.
Escribe *hola* para comenzar de nuevo.`;
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




