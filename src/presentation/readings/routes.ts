import { Router } from "express";
import { ReadingsController } from "./controller";
import { ReadingService, SharedService } from "../services";



export class ReadingsRoutes {

    static get routes(): Router {
        const router = Router();
        const sharedService = new SharedService();
        const readingService = new ReadingService( sharedService );
        const controller = new ReadingsController( readingService );

        router.get("/", controller.getReadings);
                
        router.post("/", controller.createReading);
        
        router.post("/:id", controller.updateReading);

        router.delete("/:id", controller.deleteReading);

        return router;
    };
}

