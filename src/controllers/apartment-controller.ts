import ApartmentService from '../services/apartment-service';
import { IApartment } from '../models/apartment-model';
import { Request, Response } from 'express';
import * as responses from '../services/response-service'
import { IApartmentUser } from 'models/apartment-user-model';
const jwt = require('jsonwebtoken');

export class ApartmentController {
    private apartmentService: ApartmentService = new ApartmentService();



    public createApartment(req: Request, res: Response) {
        const params: IApartment = req.body;
        var token = req.headers.authorization;
        const {userId} = jwt.verify(token, process.env.JWT_SECRET);

        this.apartmentService.createApartment(params, userId, (err: any, user_data: IApartment) => {
            if (err) {
                responses.mongoError(err, res);
            } else {
                responses.successResponse('apartment created successfully', user_data, res);
            }
        });
    }
    public getApartment(id: string, res: Response) {
        this.apartmentService.getApartment(id, (err: any, user_data: IApartmentUser) => {
            if (err) {
                responses.mongoError(err, res);
            } else {
                responses.successResponse('returns apartment by id', user_data, res);
            }
        });
    }
    public getAllApartments(req: Request, res: Response) {
        this.apartmentService.getAllApartments((err: any, user_data: IApartment) => {
            if (err) {
                responses.mongoError(err, res);
            } else {
                responses.successResponse('returns all apartments', user_data, res);
            }
        });
    }

    public deleteAllApartments(res: Response){
        this.apartmentService.deleteAllApartments((err: any, user_data: IApartment) => {
                if (err) {
                    responses.mongoError(err, res);
                } else {
                    responses.successResponse('all apartments deleted successfully', user_data, res);
                }
            }
        )
    }

    public deleteApartment(res: Response){
        this.apartmentService.deleteAllApartments((err: any, user_data: IApartment) => {
                if (err) {
                    responses.mongoError(err, res);
                } else {
                    responses.successResponse('apartment deleted successfully', user_data, res);
                }
            }
        )
    }
}