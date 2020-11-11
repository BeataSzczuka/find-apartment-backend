import { callbackify } from "util";
import { IApartment } from "../models/apartment-model";
import apartments from '../schemas/apartment-schema';

export default class ApartmentService {
    public createApartment(params: IApartment, callback: any) {
        const _session = new apartments(params);
        _session.save(callback);
    }

    public getApartment(id: string, callback: any) {
        apartments.findById(id, callback);
    }

    public getAllApartments(callback: any) {
        apartments.find({}, callback)
    }

    public deleteAllApartments(callback: any) {
        apartments.deleteMany({}, callback)
    }
}