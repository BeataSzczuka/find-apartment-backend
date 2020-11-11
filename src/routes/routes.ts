
import { Application, Request, Response } from 'express';
import { ApartmentController } from '../controllers/apartment-controller';

export class ApartmentRoutes {

    private ApartmentController: ApartmentController = new ApartmentController();

    public route(app: Application) {
        
        app.post('/api/apartments', (req: Request, res: Response) => {
            this.ApartmentController.createApartment(req, res);
        });

        app.get('/api/apartments/:id', (req, res: Response) => {
            this.ApartmentController.getApartment(req.params.id, res);
        });

        app.get('/api/apartments', (req: Request, res: Response) => {
            this.ApartmentController.getAllApartments(req, res);
        });

        app.delete('/api/apartments', (req: Request, res: Response) => {
            this.ApartmentController.deleteAllApartments(res);
        });
    }
}