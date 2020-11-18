
import { Application, Request, Response } from 'express';
import {ApartmentRoutes} from './apartment-routes';
import { UserRoutes } from './user-routes';
export class Routes {

    private apartment_routes: ApartmentRoutes = new ApartmentRoutes();
    private user_routes: UserRoutes = new UserRoutes();

    public route(app: Application) {
        this.apartment_routes.route(app);
        this.user_routes.route(app);
    }
}