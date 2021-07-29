import { IApartmentUser } from "models/apartment-user-model";
import { IApartment } from "../models/apartment-model";
import users from '../schemas/user-schema';
import apartments from '../schemas/apartment-schema';
import { IFilterRanges } from "models/filter-ranges-model";
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

        if (!queryObject.pageSize) {
            queryObject.pageSize = 20;
        }

        const query: any = {
            isDeleted: false,
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

        let amount = 0;
        apartments.countDocuments(query).exec(function(error: any, count: any) {
            amount = count;
        });

        console.log(queryObject);

        apartments.find(query).limit(parseInt(queryObject.pageSize))
            .skip(parseInt(queryObject.page) * parseInt(queryObject.pageSize))
            .sort(this.getSortMethod(queryObject.sort))
            .exec(function(err: any, result: any[]) {
                if (err) {
                    callback(err, null);
                } else {
                    const allApartmentsResult = {
                        apartments: result,
                        page: queryObject.page,
                        pages: Math.ceil(amount / queryObject.pageSize)
                    };
                    callback(err, allApartmentsResult);
                }
    })
    }

    public deleteAllApartments(callback: any) {
        apartments.deleteMany({}, callback);
    }

    public deleteApartment(id: string, user:any, callback: any) {
        apartments.findById(id, async function(err: any, data: IApartmentUser){
            if (!err && data.author == user) {
                apartments.updateOne({_id: new mongodb.ObjectID(id)}, {$set: {isDeleted: true} } )
                    .then((data: any) => callback(null, data))
                    .catch((err: any) => callback(err));
            } else {
                callback(err);
            }
        });
    }


    public restoreApartment(id: string, user:any, callback: any) {
        apartments.findById(id, async function(err: any, data: IApartmentUser){
            if (!err && data.author == user) {
                apartments.updateOne({_id: new mongodb.ObjectID(id)}, {$set: {isDeleted: false} } )
                    .then((data: any) => callback(null, data))
                    .catch((err: any) => callback(err));
            } else {
                callback(err);
            }
        });
    }
    
    public getFilterRanges(callback: any) {
        apartments.aggregate([
            { $match: { isDeleted : false } },
            { $group : { 
                    _id: null,
                    priceMax: { $max : "$price" },
                    priceMin: { $min : "$price" },
                    propertySizeMax: { $max : "$propertySize" },
                    propertySizeMin: { $min : "$propertySize" }
                }
            }]).exec(
                function(err: any, result: any[]) {
                    if (err) {
                        callback(err, null);
                    } else {
                        const data: IFilterRanges = {
                            propertySizeFrom: result[0].propertySizeMin,
                            propertySizeTo: result[0].propertySizeMax,
                            priceFrom: result[0].priceMin,
                            priceTo: result[0].priceMax,
                        };
                        callback(err, data);
                    }
                }
        );
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