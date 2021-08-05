import ApartmentService from '../services/apartment-service';
import { IApartment } from '../models/apartment-model';
import { Request, Response } from 'express';
import * as responses from '../services/response-service'
import { IApartmentUser } from 'models/apartment-user-model';
import { IFilterRanges } from 'models/filter-ranges-model';
import { uploadImage } from '../helpers/helpers';
const jwt = require('jsonwebtoken');
const url = require('url');


export class ApartmentController {
    private apartmentService: ApartmentService = new ApartmentService();

    public async createApartment(req: any, res: Response) {
        const body = JSON.parse(JSON.parse(JSON.stringify(req.body)).upload);
        const params: IApartment = {
            description: body.description,
            location: body.location,
            propertySize: body.propertySize,
            price: body.price,
            transactionType: body.transactionType,
            images: []
        } ;
        var token = req.headers.authorization;
        this.getUserByToken(token, (err: any, userId: string) => {
            if (err != null) {
                responses.unauthorizedResponse(err, res);
            }
            else {
                params.images = [];
                const promises: Promise<String>[] = [];
                let exception = null;
                req.files.forEach(async (file: any ) => {
                    try {
                        const myFile = file
                        promises.push( uploadImage(myFile) );
                
                    } catch (error) {
                        exception = error;
                        responses.mongoError(error, res);
                        return;
                    }
                });
                Promise.all(promises)
                .then((values: String[]) => {
                    params.images = values.map((value: String) => ({filename: value, contentType: 'image/jpg'}));
                    this.apartmentService.createApartment(params, userId, (err: any, user_data: IApartment) => {
                    if (err) {
                        responses.mongoError(err, res);
                    } else {
                        responses.successResponse('Ogłoszenie zostało dodane', user_data, res);
                    }
                });
                })
                .catch((e)=> {
                    responses.mongoError(e, res);
                });
            }
        });
       
        
    }

    public updateApartment(id: string, req: any, res: Response) {
        const body = JSON.parse(JSON.parse(JSON.stringify(req.body)).upload);
        const params: IApartment = {
            description: body.description,
            location: body.location,
            propertySize: body.propertySize,
            price: body.price,
            transactionType: body.transactionType,
            images: body.unchangedImages.map((value: String) => ({filename: value, contentType: 'image/jpg'}))
        } ;
        var token = req.headers.authorization;
        this.getUserByToken(token, (err: any, userId: string) => {
            if (err != null) {
                responses.unauthorizedResponse(err, res);
            }
            else {
                const promises: Promise<String>[] = [];
                req.files.forEach(async (file: any ) => {
                    try {
                        const myFile = file
                        promises.push( uploadImage(myFile) );
                 
                    } catch (error) {
                        responses.mongoError(error, res);
                        return;
                    }
                });
        
                Promise.all(promises)
                .then((values: String[]) => {
                    params.images = params.images.concat( values.map((value: String) => ({filename: value, contentType: 'image/jpg'})) );
                    this.apartmentService.updateApartment(id, params, userId, (err: any, user_data: IApartment) => {
                        if (err) {
                            responses.mongoError(err, res);
                        } else {
                            responses.successResponse('Ogłoszenie zostało zaktualizowane', user_data, res);
                        }
                    });
                })
                .catch((e)=> {
                    responses.mongoError(e, res);
                 });
            }
        });
    }

    public getApartment(id: string, req: any, res: Response) {
        this.apartmentService.getApartment(id, (err: any, user_data: IApartmentUser) => {
            if (err) {
                responses.mongoError(err, res);
            } else {
                responses.successResponse('returns apartment by id', user_data, res);
            }
        });
    }
    public getAllApartments(req: any, res: Response) {
        var token = req.headers.authorization;
        const hasOnlyMyParam = url.parse(req.url,true).query.onlyMy;
        if (token && hasOnlyMyParam) {
            this.getUserByToken(token, (err: any, userId: string) => {
                if (err != null) {
                    responses.unauthorizedResponse(err, res);
                }
                else {
                    this.apartmentService.getAllApartments(req, userId, (err: any, user_data: IApartment[]) => {
                        if (err) {
                            responses.mongoError(err, res);
                        } else {
                            responses.successResponse('returns all apartments', user_data, res);
                        }
                    });
                }

            });
        } else {
            this.apartmentService.getAllApartments(req, null, (err: any, user_data: IApartment[]) => {
                if (err) {
                    responses.mongoError(err, res);
                } else {
                    responses.successResponse('returns all apartments', user_data, res);
                }
            });
        }
       
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
        this.getUserByToken(token, (err: any, userId: string) => {
            if (err != null) {
                responses.unauthorizedResponse(err, res);
            }
            else {
                this.apartmentService.deleteApartment(id, userId, (err: any, user_data: IApartment) => {
                    if (err) {
                        responses.mongoError(err, res);
                    } else {
                        responses.successResponse('Ogłoszenie zostało usunięte', user_data, res);
                    }
                }
            );
            }
        });
        
    }

    public restoreApartment(id: string, req: any, res: Response){
        var token = req.headers.authorization;
        this.getUserByToken(token, (err: any, userId: string) => {
            if (err != null) {
                responses.unauthorizedResponse(err, res);
            }
            else {
                this.apartmentService.restoreApartment(id, userId, (err: any, user_data: IApartment) => {
                    if (err) {
                        responses.mongoError(err, res);
                    } else {
                        responses.successResponse('Ogłoszenie zostało przywrócone', user_data, res);
                    }
                }
            )
            }
        });       
    }


    public getFilterRanges(res: Response) {
        this.apartmentService.getFilterRanges((err: any, data: IFilterRanges) => {
            if (err) {
                responses.mongoError(err, res);
            } else {
                responses.successResponse('returns filtering ranges', data, res);
            }
        });
    }

    private getUserByToken(token: string, callback: any) {
        if (token != undefined) {
            try {
                const {userId} = jwt.verify(token, process.env.JWT_SECRET);
                return callback(null, userId);
            } catch  (err) {
                return callback("Unauthorized", null);
            }
        } else return callback("Unauthorized", null);
    }
}