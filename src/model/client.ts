export interface ClientLogin {
  nickname: string,
  password: string,
}


export interface UserData extends ClientLogin {
  email: string
}

export type userStateData = Partial<UserData>


export interface Client {
  id: number,
  nickname: string,
  password: string,
  email: string
}
export type clientData = Partial<Client>


