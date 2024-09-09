import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { UsersRoutes } from "./users/routes";
import { SensorsRoutes } from "./sensors/routes";
import { StationsRoutes } from "./stations/routes";
import { NetworksRoutes } from "./networks/routes";
import { ReadingsRoutes } from "./readings/routes";
import { AuthMiddleware } from "./middlewares/auth.middleware";
import { SubscriptionsRoutes } from "./subscriptions/routes";
import { CountryRoutes } from "./countries/routes";

export class AppRoutes {

    static get routes(): Router {        
        const router = Router();

        // Routes
        router.use('/auth',         AuthRoutes.routes );            
        router.use('/api/users',    UsersRoutes.routes );
        router.use('/api/readings', ReadingsRoutes.routes );
        router.use('/api/sensors',  SensorsRoutes.routes  );
        router.use('/api/stations', StationsRoutes.routes );
        router.use('/api/networks', NetworksRoutes.routes );
        router.use('/api/subscriptions', SubscriptionsRoutes.routes );
        router.use('/api/countries',     CountryRoutes.routes );

        return router;
    }
}