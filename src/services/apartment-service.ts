import { IApartmentUser } from "models/apartment-user-model";
import { IApartment } from "../models/apartment-model";
import users from '../schemas/user-schema';
import apartments from '../schemas/apartment-schema';
var mongodb = require('mongodb');
const url = require('url');

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


    public updateApartment(id: string, params: IApartment, userId: String, callback: any) {

        apartments.findByIdAndUpdate(id, {$set: {...params}}, {upsert: false})
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
                if (user != null && data.author == user) {
                    result.isAuthor = true;
                } 
            } 
            callback(err, result);
        });
    }

    public getAllApartments(req: any, user: any, callback: any) {
        const queryObject = url.parse(req.url,true).query;

        const query: any = {
            price: this.getPriceRange(queryObject.priceFrom, queryObject.priceTo),
            propertySize: this.getSizeRange(queryObject.propertySizeFrom, queryObject.propertySizeTo),
            location: { $regex: new RegExp(queryObject.location ? queryObject.location : "", 'i') }
        };

        if (queryObject.onlyMy != null && user != null) {
            query.author = user;
        }

        if (queryObject.transactionType != null) {
            query.transactionType = queryObject.transactionType
        }

        apartments.find(query)
            .limit(parseInt(queryObject.pageSize))
            .skip(parseInt(queryObject.page) * parseInt(queryObject.pageSize))
            .sort(this.getSortMethod(queryObject.sort))
            .exec(function(err: any, result: any) {
                apartments.countDocuments().exec(function(err: any, count: any) {
                    const allApartmentsResult = {
                        apartments: result,
                        page: queryObject.page,
                        pages: Math.ceil(count / queryObject.pageSize)
                    };
                    callback(err, allApartmentsResult);
                })
    })
    }

    public deleteAllApartments(callback: any) {
        apartments.deleteMany({}, callback);
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

    private getSortMethod(querySortMethod: string) {
        if (querySortMethod === "PRICE_ASC") {
            return {price: "asc"};
        } else if (querySortMethod === "PRICE_DESC") {
            return {price: "desc"};
        } else {
            return {publicationDate: "desc"};
        }
    }

    private getPriceRange(queryPriceFrom: string, queryPriceTo: string) {
        let price: any = { $gte: "0" };
        if (queryPriceFrom) {
            price.$gte = queryPriceFrom;
        }
        if (queryPriceTo) {
            price.$lte = queryPriceTo;
        }
        return price;
    }

    private getSizeRange(queryPropSizeFrom: string, queryPropSizeTo: string) {
        let propertySize: any = { $gte: "0" };
        if (queryPropSizeFrom) {
            propertySize.$gte = queryPropSizeFrom;
        }
        if (queryPropSizeTo) {
            propertySize.$lte = queryPropSizeTo;
        }
        return propertySize;
    }

}