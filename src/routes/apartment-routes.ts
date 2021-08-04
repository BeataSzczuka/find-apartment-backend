
import { Application, NextFunction, Request, Response } from 'express';
import { authMiddleware } from '../custom-middlewares/auth-middleware';
import { IUserRequest } from 'models/user-request-model';
import { ApartmentController } from '../controllers/apartment-controller';

const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

var aws = require('aws-sdk')
var multerS3 = require('multer-s3')

export class ApartmentRoutes {

    private ApartmentController: ApartmentController = new ApartmentController();


    private multerMid = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    })

    public route(app: Application) {

        app.put("/api/update/:id", this.multerMid.array('uploads', 6), (req: any, res) => {
          this.ApartmentController.updateApartment(req.params.id, req, res);
        });

        
        app.post("/api/upload", this.multerMid.array('uploads', 6), (req: any, res) => {
              this.ApartmentController.createApartment(req, res);
            });

        app.get('/api/apartments/filter-ranges', (req: Request, res: Response) => {
          this.ApartmentController.getFilterRanges(res);       
        });

        app.get('/api/apartments/:id', (req: any, res: Response) => {
            this.ApartmentController.getApartment(req.params.id, req, res);
        });
        
        app.get('/api/apartments', (req: any, res: Response) => {
            this.ApartmentController.getAllApartments(req, res);
        });

        app.delete('/api/apartments/:id', (req: Request, res: Response) => {
            this.ApartmentController.deleteApartment(req.params.id, req, res);
        });

        app.post('/api/restoreapartment/:id', (req: Request, res: Response) => {
          this.ApartmentController.restoreApartment(req.params.id, req, res);
        });

        app.delete('/api/apartments', (req: Request, res: Response) => {
          this.ApartmentController.deleteAllApartments(res);       
        });
    }
}