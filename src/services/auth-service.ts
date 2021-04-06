import { IUser } from "models/user-model";
import { callbackify } from "util";
import userSchema from "../schemas/user-schema";
import users from '../schemas/user-schema';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
//const User = require('../schemas/user-schema');

async function createPasswordHash(passwd: string) {
    return await bcrypt.hash(passwd, 10);
}
async function validatePassword(password: string, passwordHash: string) {
    return await bcrypt.compare(password, passwordHash);
}

export default class AuthService {
    public async createUser(req: any, callback: any) {
        try{
            const {email, password, phoneNumber, role} = req.body;
            const passwordHash = await createPasswordHash(password);
            const user = new users({email, phoneNumber, password: passwordHash, role: role || "basic"});
            const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                expiresIn: "1d"
            });
            user.accessToken = accessToken;
            await user.save(callback);
        }catch (error){
            callback(error);
        }
    }

    public getUser(id: string, callback: any) {
        users.findById(id, callback)
    }

    public async login(req: any, callback: any) {
        try {
            const { email, password } = req.body;
            const user = await users.findOne({ email });
            if (!user) 
                return callback(new Error('Email does not exist'));
            const validPasswd = await validatePassword(password, user.password);
            if (!validPasswd) 
                return callback(new Error('Password is not correct'))
            const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
             expiresIn: "1d"
            });
            await users.findByIdAndUpdate(user._id, { accessToken })
            callback(null, {
             user: { email: user.email, role: user.role },
             accessToken
            })
        } catch (error) {
            callback(error);
        }
    }

    public async logout(req: any, callback: any) {
        try{
            var token = req.headers.authorization;
            console.log(req);
            const {userId, exp} = jwt.verify(token, process.env.JWT_SECRET);
            const loggedInUser = await userSchema.findById(userId);
            await users.findByIdAndUpdate(loggedInUser._id, { accessToken: null });
            callback();
       } catch (error) {
        callback(new Error('Bad Request'))
       }
    }
}