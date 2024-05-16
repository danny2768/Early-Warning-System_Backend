import { Router } from "express";
import { SharedService, StationService } from "../services";
import { StationsController } from "./controller";

export class StationsRoutes {
    
    static get routes(): Router {
        const router = Router();
        const sharedService = new SharedService();
        const stationService = new StationService(sharedService);
        const controller = new StationsController(stationService);

        router.get("/", controller.getStations);
        router.get("/by-network/:id", controller.getStationsByNetworkId);
        router.get("/:id", controller.getStationById);

        router.post("/", controller.createStation);

        router.put("/:id", controller.updateStation);

        router.delete("/:id", controller.deleteStation);
        
        return router;
    }
}