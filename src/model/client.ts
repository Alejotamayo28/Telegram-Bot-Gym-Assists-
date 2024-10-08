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
