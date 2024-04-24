import { Router } from "express";
import { NetworksController } from "./controller";
import { NetworkService, SharedService } from "../services";


export class NetworksRoutes {

    static get routes(): Router {
        const router = Router();
        const sharedService = new SharedService();
        const networkService = new NetworkService(sharedService);
        const controller = new NetworksController(networkService);

        router.get("/", controller.getNetworks);
        router.get("/:id", controller.getNetworkById);

        router.post("/", controller.createNetwork);

        router.put("/:id", controller.updateNetwork);

        router.delete("/:id", controller.deleteNetwork);
        return router;
    };
}
