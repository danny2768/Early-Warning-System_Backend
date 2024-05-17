import { Router } from "express";
import { SensorsController } from "./controller";
import { SensorService, SharedService } from "../services";


export class SensorsRoutes {

    static get routes(): Router {
        const router = Router();
        const sharedService = new SharedService();
        const sensorService = new SensorService(sharedService);
        const controller = new SensorsController(sensorService);

        router.get("/", controller.getSensors);
        router.get("/by-station/:id", controller.getSensorByStationId);
        router.get("/:id/readings", controller.getSensorReadings);
        router.get("/:id", controller.getSensorById);

        router.post("/", controller.createSensor);

        router.put("/:id", controller.updateSensor);

        router.delete("/:id", controller.deleteSensor);
        return router;
    };
}

