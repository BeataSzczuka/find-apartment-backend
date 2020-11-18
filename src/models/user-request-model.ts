import { Request } from "express"
import { IUser } from "./user-model";

export interface IUserRequest extends Request {
  user?: IUser;
}