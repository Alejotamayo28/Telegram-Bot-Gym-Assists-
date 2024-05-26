export interface ClientLogin {
  nickname: string,
  password: string,
}

export interface ClientData extends ClientLogin {
  age: number;
  gender: string;
  email: string;
  weight: number;
  height: number;
}

