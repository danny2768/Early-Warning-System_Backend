import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { SensorsRoutes } from "./sensors/routes";

export class AppRoutes {

    static get routes(): Router {        
        const router = Router();

        // Routes
        router.use('/api/auth', AuthRoutes.routes );    
        router.use('/api/sensors', SensorsRoutes.routes );
        
        // router.use('/api/auth', /* AuthRoutes.routes */ );

        

        return router;
    }
}