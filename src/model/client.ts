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



type getClientData = ClientData
type createClientData = ClientData
type updateClientData = Partial<ClientData>
type deleteClientData = Pick<ClientData, "id">


