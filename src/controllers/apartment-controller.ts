import ApartmentService from '../services/apartment-service';
import { IApartment } from '../models/apartment-model';
import { Request, Response } from 'express';
import * as responses from '../services/response-service'
import { IApartmentUser } from 'models/apartment-user-model';
const jwt = require('jsonwebtoken');
var fs = require('fs');

export class ApartmentController {
    private apartmentService: ApartmentService = new ApartmentService();



    public createApartment(req: any, res: Response) {
        const params: IApartment = JSON.parse(req.body.upload);
        var token = req.headers.authorization;
        const userId = this.getUserByToken(token, res);
       
        params.images = [];
        req.files.forEach((file: any ) => {
            let image = {data: fs.readFileSync(file.path), contentType: 'image/jpg'};
            params.images.push(image);
        });

        this.apartmentService.createApartment(params, userId, (err: any, user_data: IApartment) => {
            if (err) {
                responses.mongoError(err, res);
            } else {
                responses.successResponse('apartment created successfully', user_data, res);
            }
        });
    }
    public getApartment(id: string, req: any, res: Response) {
        var token = req.headers.authorization;
        let user = null;
        if (token) {
            user = this.getUserByToken(token, res);
        }
        this.apartmentService.getApartment(id, user, (err: any, user_data: IApartmentUser) => {
            if (err) {
                responses.mongoError(err, res);
            } else {
                responses.successResponse('returns apartment by id', user_data, res);
            }
        });
    }
    public getAllApartments(req: any, res: Response) {
        this.apartmentService.getAllApartments(req, (err: any, user_data: IApartment[]) => {
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

    public deleteApartment(id: string, req: any, res: Response){
        var token = req.headers.authorization;
        const userId = this.getUserByToken(token, res);
        this.apartmentService.deleteApartment(id, userId, (err: any, user_data: IApartment) => {
                if (err) {
                    responses.mongoError(err, res);
                } else {
                    responses.successResponse('apartment deleted successfully', user_data, res);
                }
            }
        )
    }

    private getUserByToken(token: string, res: Response) {
        if (token != undefined) {
            try {
                const {userId} = jwt.verify(token, process.env.JWT_SECRET);
                return userId;
            } catch  (err) {
                if (err instanceof jwt.TokenExpiredError) {
                    return res.status(400).send("TokenExpired");
                }
            }
        }
    }
}