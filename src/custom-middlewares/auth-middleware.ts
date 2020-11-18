import { NextFunction,Request,Response } from "express";
import userSchema from "../schemas/user-schema";
const jwt = require('jsonwebtoken');

export const authMiddleware = async function (req: Request, res: Response, next: NextFunction) {
  try {
    var token = req.headers.authorization;   
    const {userId, exp} = jwt.verify(token, process.env.JWT_SECRET);
    const loggedInUser = await userSchema.findById(userId);
    if (loggedInUser.accessToken !== token) {
      throw new Error('Unauthorized');
    }
    if (exp < Date.now().valueOf() / 1000) {
      throw new Error('JWT token has expired');
    }
    next();
  } catch (e) {
    res.status(401).json({message: e.message})
  }
     
  }
   
