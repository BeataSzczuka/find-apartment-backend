
import { Application, NextFunction, Request, Response } from 'express';
import { authMiddleware } from '../custom-middlewares/auth-middleware';
import { IUserRequest } from 'models/user-request-model';
import { ApartmentController } from '../controllers/apartment-controller';

const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

export class ApartmentRoutes {

    private ApartmentController: ApartmentController = new ApartmentController();


    private storage = multer.diskStorage({
        destination: './uploads/',
        filename: function(req: any, file: any, cb: any) {
          return crypto.pseudoRandomBytes(16, function(err: any, raw: any) {
            if (err) {
              return cb(err);
            }
            return cb(null, "" + (raw.toString('hex')) + (path.extname(file.originalname)));
          });
        }
      });

    public route(app: Application) {
        
        app.post("/api/upload", multer({
              storage: this.storage
            }).array('uploads'), (req: any, res) => {
              this.ApartmentController.createApartment(req, res);
            });


        app.get('/api/apartments/:id', (req: any, res: Response) => {
            this.ApartmentController.getApartment(req.params.id, req, res);
        });
        
        app.get('/api/apartments', (req: Request, res: Response) => {
            this.ApartmentController.getAllApartments(req, res);
        });

        app.delete('/api/apartments/:id', (req: Request, res: Response) => {
            this.ApartmentController.deleteApartment(req.params.id, req, res);
        });

        app.delete('/api/apartments', (req: Request, res: Response) => {
          this.ApartmentController.deleteAllApartments(res);
      });
    }
}