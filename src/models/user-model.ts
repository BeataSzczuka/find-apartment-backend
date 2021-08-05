export interface IUser {
  email: String,
  password: String,
  role: Roles,
  accessToken: String,
}

enum Roles {
  BASIC,
  ADMIN
}