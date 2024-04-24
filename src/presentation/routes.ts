import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { SensorsRoutes } from "./sensors/routes";
import { StationsRoutes } from "./stations/routes";
import { NetworksRoutes } from "./networks/routes";

export class AppRoutes {

    static get routes(): Router {        
        const router = Router();

        // Routes
        router.use('/api/auth', AuthRoutes.routes );    
        // TODO: Add routes for readings
        // router.use('/api/readings', /*SensorsRoutes.routes*/ );
        router.use('/api/sensors', SensorsRoutes.routes );
        router.use('/api/stations', StationsRoutes.routes );
        router.use('/api/networks', NetworksRoutes.routes );        

        

        return router;
    }
}