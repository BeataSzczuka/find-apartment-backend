
import { Application, Request, Response } from 'express';
import { ApartmentController } from '../controllers/apartment-controller';

export class ApartmentRoutes {

    private ApartmentController: ApartmentController = new ApartmentController();

    public route(app: Application) {
        
        app.post('/api/apartments', (req: Request, res: Response) => {
            this.ApartmentController.createApartment(req, res);
        });

        app.get('/api/apartments/:id', (req: Request, res: Response) => {
            this.ApartmentController.getApartment(req, res);
        });

        app.get('/api/apartments', (req: Request, res: Response) => {
            this.ApartmentController.getAllApartments(req, res);
        });
    }
}