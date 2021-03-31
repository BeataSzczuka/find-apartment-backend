
import { Application, Request, Response } from 'express';
import { AuthController } from '../controllers/auth-controller';

export class UserRoutes {

    private authController: AuthController = new AuthController();

    public route(app: Application) {
        
        app.post('/api/users/signup', (req: Request, res: Response) => {
            this.authController.signup(req, res);
        });

        app.post('/api/users/login', (req: Request, res: Response) => {
            this.authController.login(req, res);
        });

        app.post('/api/users/logout', (req: Request, res: Response) => {
            this.authController.logout(req, res);
        });

        app.get('/api/users/:id', (req: Request, res: Response) => {
            this.authController.getUser(req.params.id, res);
        });
    }
}