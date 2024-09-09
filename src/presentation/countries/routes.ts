import { Router } from "express";
import { CountriesController } from "./controller";

export class CountryRoutes {
    
    static get routes(): Router {
        const router = Router();
        const controller = new CountriesController();

        router.get("/", controller.getCountries);
        router.get("/id/:id", controller.getCountryById);
        router.get("/iso/:iso3", controller.getCountryByIso3);
        
        return router;
    }
}