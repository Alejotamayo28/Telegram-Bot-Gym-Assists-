import { StringMappingType } from "typescript";
import { ClientData, ClientLogin } from "../model/interface/client";
import { PoolClient, QueryResult } from "pg";
import { getWorkoutAllDataQuery } from "../queries/workoutQueries";
import { workout } from "../model/enum/Routes";

export const mainPage = () => {
  return `¡Hola! ¿Eres un usuario registrado o te gustaría crear una cuenta?
      
      - Si ya estás registrado, digita: *1*
      - Si deseas crear una cuenta, digita: *2*
      
      Ejemplos:
      - Para iniciar sesión, digita: *11*
      - Para crear una cuenta, digita: *22*`;
}

export const loginPage = () => {
  return `Por favor, ingresa tus datos para iniciar sesión, por ejemplo:
      
      *nickname contraseña*`;
}

export const singUpPage = () => {
  return `Para crear una cuenta, por favor proporciona la siguiente información:
      
      *nickname contraseña nombre apellido edad género email peso altura*`;
}

export const loginPageExample = () => {
  return `Ejemplo para iniciar sesión:
      
      *usuario1 contraseña1*
      
      Recuerda reemplazar los valores de ejemplo con tus datos personales. 
      Vuelve a escribir "hola" para comenzar de nuevo.`

}

export const singUpPageExample = () => {
  return `Ejemplo para crear una cuenta:
      
      *usuario2 contraseña2 Juan Pérez 25 masculino juan@example.com 70 175*
      
      Recuerda reemplazar los valores de ejemplo con tus datos personales. Vuelve a escribir "hola" para comenzar de nuevo.`;

}

export const loginPageUserNotFound = () => {
  return `Usuario no encontrado, escribe "Hola" y comienza a crear tu cuenta!`
}

export const loginPagePasswordIncorrect = () => {
  return `Contrasena incorreceta, vuelve a escribir tu nickname y contrasena`
}

export const singUpPageUserNotAvailable = () => {
  return `Nickname no disponible, vuelve a escribir tus datos personales`
}

export const userCreatedSuccesfully = () => {
  return `Usuario creado satisfacctoriamente, vuelve a escribir "name" para iniciar session`
}

export const userLoginSuccesfully = (nickname: string) => {
  return `Usuario logeado satisfactoriamente.

Bienvenido, *${nickname}!*

Escribe "menu" para ingresar a tu menu de usuario`
}

export const menuPage = () => {
  return `Hola! Este es el menu de usuario:
- Crear ejercicio, digita: *1*
- Actualizar ejercicio, digita: *2*
- Eliminar ejercicio, digita: *3*
- Obtener ejercicios, digita: *4*
- Obtener ejercicios por dia, digita *5*

Ejemplos:
- Para crear ejercicio, digita *11*:
- Para actualizar ejercicio, digita *22*:
- Para eliminar ejercicio, digita *33*:
- Para obtener ejercicios, digita *44*:
- Para obtener ejercicios por dia, digita *55*:`
}
export const menuPageUserNotFound = () => {
  return `Nickname no encontrado. Por favor digita "menu" para volver a tu menu de usuario`
}

export const menuPageCreateExercise = () => {
  return `Para crear un ejercicio, por favor proporciona la siguiente informacion:

*day name series {rep1, rep2, rep3} kg*`
}

export const menuPageUpdateExercise = () => {
  return `Para actualizar un ejercicio, por favor proporciona la siguiente informacion:

*day name series {rep1, rep2, rep3} kg*`
}

export const menuPageDeleteExercise = () => {
  return `Para eliminar un ejercicio, por favor proporciona la siguiente informacion:

*day exercise_name*`
}

export const menuPageGetExercises = async (client: PoolClient, id: any) => {
  let monday = 'Monday: \n'
  let friday = 'Friday: \n'
  const response: QueryResult = await getWorkoutAllDataQuery(client, id)
  response.rows.map(row => {
    if (row.day === 'monday') {
      monday += `- Nombre: ${row.name}, series: ${row.series}, repeticiones: {${row.reps}}, peso: ${row.kg}.\n`
    } else if (row.day === 'friday') {
      friday += `- Nombre: ${row.name}, series: ${row.series}, repeticiones: {${row.reps}}, peso: ${row.kg}.\n`
    }
  }).join('\n')
  return monday + friday


}

export const menuPageGetExercisePerDay = () => {
  return `Para obtener los ejercicios de un dia especifico, por favor proporciona la siguiente informacion:
*day*`
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




