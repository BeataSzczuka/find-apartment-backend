import { IApartmentUser } from "models/apartment-user-model";
import { IApartment } from "../models/apartment-model";
import apartments from '../schemas/apartment-schema';
import users from '../schemas/user-schema';
var mongodb = require('mongodb');

export default class ApartmentService {
    public createApartment(params: IApartment, userId: String, callback: any) {

        apartments.create({...params, author: userId, publicationDate: new Date()})
            .then(async (apartment: IApartment)=>{
               await users.findByIdAndUpdate(userId, {$push: {apartments: apartment._id}}, {new: true});
                return apartment;
            })
            .then((data: any) => callback(null, data))
            .catch((err: any) => callback(err));

    }

    public getApartment(id: string, user:any, callback: any) {
        apartments.findById(id, async function(err: any, data: any){
            let result;
            if (!err) {
                result = Object.assign({isAuthor: false}, data._doc);
                const author = await users.findById(data.author);
                result.phoneNumber = author.phoneNumber;
                result.email = author.email;
                if (data.author == user) {
                    result.isAuthor = true;
                } 
            } 
            callback(err, result);
        });
    }

    public getAllApartments(callback: any) {
        apartments.find({}, callback)
    }

    public deleteAllApartments(callback: any) {
        apartments.deleteMany({}, callback)
    }

    public deleteApartment(id: string, user:any, callback: any) {
        apartments.findById(id, async function(err: any, data: IApartmentUser){
            if (!err && data.author == user) {
                apartments.deleteOne({_id: new mongodb.ObjectID(id)}, callback);
            } else {
                callback(err);
            }
        });
    }
}