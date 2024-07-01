export interface ClientLogin {
  nickname: string,
  password: string,
}

export interface ClientData extends ClientLogin {
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

