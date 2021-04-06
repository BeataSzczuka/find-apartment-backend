import { IApartmentUser } from "models/apartment-user-model";
import { IApartment } from "../models/apartment-model";
import apartments from '../schemas/apartment-schema';
import users from '../schemas/user-schema';

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

    public getApartment(id: string, callback: any) {
        apartments.findById(id, async function(err: any, data: IApartmentUser){
            if (!err) {
                const author = await users.findById(data.author);
                data.phoneNumber = author.phoneNumber;
                data.email = author.email;
            } 
            callback(err, data);
        });
    }

    public getAllApartments(callback: any) {
        apartments.find({}, callback)
    }

    public deleteAllApartments(callback: any) {
        apartments.deleteMany({}, callback)
    }
}