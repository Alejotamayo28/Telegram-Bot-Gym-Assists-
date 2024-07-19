import { PoolClient, QueryResult } from "pg"
import { ClientLogin } from "../model/interface/client"


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

export const menuPageGetExercises = async (client: PoolClient, id: any) => {
  let lunes = 'Lunes: \n'
  let martes = 'Martes:  \n'
  let miercoles = 'Miercoles: \n'
  let jueves = 'Jueves: \n'
  let viernes = 'Viernes: \n'
  let sabado = 'Sabado: \n'
  let domingo = 'Domingo: \n'

  const response: QueryResult = await client.query(`SELECT * FROM workout WHERE id = $1`, [id])

  response.rows.map(row => {
    if (row.day === 'lunes') {
      lunes += `${row.name}, repeticiones: {${row.reps}}, peso: ${row.kg}.\n`
    } else if (row.day === 'martes') {
      martes += `${row.name}, repeticiones: {${row.reps}}, peso: ${row.kg}.\n`
    } else if (row.day === 'miercoles') {
      miercoles += `${row.name}, repeticiones: {${row.reps}}, peso: ${row.kg}.\n`
    } else if (row.day === 'jueves') {
      jueves += `${row.name}, repeticiones: {${row.reps}}, peso: ${row.kg}.\n`
    } else if (row.day === 'viernes') {
      viernes += `${row.name}, repeticiones: {${row.reps}}, peso: ${row.kg}.\n`
    } else if (row.day === 'sabado') {
      sabado += `${row.name}, repeticiones: {${row.reps}}, peso: ${row.kg}.\n`
    } else if (row.day === 'domingo') {
      domingo += `${row.name}, repeticiones: {${row.reps}}, peso: ${row.kg}.\n`
    }
  }).join('\n')
  return lunes + '\n' + martes + '\n' + miercoles + '\n' + jueves + '\n' + viernes + '\n' + sabado + '\n' + domingo + '\n'
}


