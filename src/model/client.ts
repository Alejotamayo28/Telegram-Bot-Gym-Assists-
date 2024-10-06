export interface ClientLogin {
  nickname: string,
  password: string,
}
export interface UserData extends ClientLogin {
  id?: number,
  email: string
}
export type PartialUserData = Partial<UserData>
