export interface UserCredentials {
  nickname: string,
  password: string,
}
export interface UserProfile extends UserCredentials {
  id?: number,
  email: string
}
export type PartialUserProfile = Partial<UserProfile>

//EXAMPLE 
export interface UserData extends UserProfile, UserCredentials {
  role: string
}
const UserData: UserData = {
  email: "",
  nickname: "",
  password: "",
  role: "admin"
}

export interface ClientCredentials {
  id?: number,
  nickname: string,
  password: string,
  email: string
}

export interface ClientInfo extends ClientCredentials {
  id?: number,
  name: string,
  lastname: string,
  age: number,
  weight: number,
  height: number
}
