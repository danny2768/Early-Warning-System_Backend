import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { SensorsRoutes } from "./sensors/routes";
import { StationsRoutes } from "./stations/routes";
import { NetworksRoutes } from "./networks/routes";
import { ReadingsRoutes } from "./readings/routes";
import { AuthMiddleware } from "./middlewares/auth.middleware";

export class AppRoutes {

    static get routes(): Router {        
        const router = Router();

        // Routes
        router.use('/api/auth', AuthRoutes.routes );            
        router.use('/api/readings', [ AuthMiddleware.validateAdminToken ], ReadingsRoutes.routes );
        router.use('/api/sensors',  [ AuthMiddleware.validateAdminToken ], SensorsRoutes.routes  );
        router.use('/api/stations', [ AuthMiddleware.validateAdminToken ], StationsRoutes.routes );
        router.use('/api/networks', [ AuthMiddleware.validateAdminToken ], NetworksRoutes.routes );                
        

        return router;
    }
}