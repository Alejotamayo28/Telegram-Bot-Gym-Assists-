export interface ClientLogin {
  nickname: string,
  password: string,
}

export interface ClientData extends ClientLogin {
  id?: number,
  first_name: string,
  last_name: string,
  age: number;
  gender: string;
  email: string;
  weight: number;
  height: number;
  created_at?: string,
  updated_at?: string
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


