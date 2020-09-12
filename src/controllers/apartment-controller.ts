import ApartmentService from '../services/apartment-service';
import { IApartment } from '../models/apartment-model';
import { Request, Response } from 'express';
import * as responses from '../services/response-service'

export class ApartmentController {
    private apartmentService: ApartmentService = new ApartmentService();

    public createApartment(req: Request, res: Response) {
        const params: IApartment = req.body;
        //  {
        //     price: req.body.price,
        //     propertySize: req.body.propertySize,
        //     location: req.body.location,
        //     description: req.body.description
        // };
        this.apartmentService.createApartment(params, (err: any, user_data: IApartment) => {
            if (err) {
                responses.mongoError(err, res);
            } else {
                responses.successResponse('create apartment successfull', user_data, res);
            }
        });
    }
    public getApartment(req: Request, res: Response) {
        //todo
        responses.successResponse('create apartment successfull', {'data': 'todo'}, res);
    }
    public getAllApartments(req: Request, res: Response) {
        //todo
        responses.successResponse('create apartment successfull', {'data': 'todo'}, res);
    }
}