import { Router } from "express";
import { SharedService, StationService } from "../services";
import { StationsController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class StationsRoutes {
    
    static get routes(): Router {
        const router = Router();
        const sharedService = new SharedService();
        const stationService = new StationService(sharedService);
        const controller = new StationsController(stationService);

        router.get("/",               [ AuthMiddleware.validateAdminToken ], controller.getStations);
        router.get("/userVisible",    [ AuthMiddleware.validateUserToken ], controller.getStationsVisibleToUser)
        router.get("/by-network/:id", [ AuthMiddleware.validateAdminToken ], controller.getStationsByNetworkId);
        router.get("/:id",            [ AuthMiddleware.validateAdminToken ], controller.getStationById);
        router.post("/",              [ AuthMiddleware.validateAdminToken ], controller.createStation);
        router.put("/:id",            [ AuthMiddleware.validateAdminToken ], controller.updateStation);
        router.delete("/:id",         [ AuthMiddleware.validateSuperAdminToken ], controller.deleteStation);
        
        return router;
    }
}

/**
 * @swagger
 * tags:
 *   name: Stations
 *   description: Stations resource
 */

/**
 * @swagger
 * /api/stations:
 *  get:
 *      summary: Get all stations
 *      tags: [Stations]
 *      responses:
 *          200:
 *              description: OK
 */

/**
 * @swagger
 * /api/stations/userVisible:
 *  get:
 *    summary: Get all stations visible to the user
 *    tags: [Stations]
 *    security:
 *      - bearerAuth: []  # Assuming bearer token auth is used for users
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                    description: Station ID
 *                  name:
 *                    type: string
 *                    description: Station name
 *                  state:
 *                    type: string
 *                    description: Station state
 *                  countryCode:
 *                    type: string
 *                    description: Station country code
 *                  coordinates:
 *                    type: object
 *                    properties:
 *                      longitude:
 *                        type: number
 *                      latitude:
 *                        type: number
 *                  city:
 *                    type: string
 *                    description: Station city
 *                  isVisibleToUser:
 *                    type: boolean
 *                    description: Visibility status for user
 *      401:
 *        description: Unauthorized. User token is invalid or missing.
 *      403:
 *        description: Forbidden. The user doesn't have permission to access this endpoint.
 */


/**
 * @swagger
 * /api/stations/by-network/{networkId}:
 *  get:
 *      summary: Get a station by network id
 *      tags: [Stations]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: network id
 *      responses:
 *          200:
 *              description: OK
 */

/**
 * @swagger
 * /api/stations/{id}:
 *  get:
 *      summary: Get a station by id
 *      tags: [Stations]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: station id
 *      responses:
 *          200:
 *              description: OK
 */

/**
 * @swagger
 * /api/stations:
 *   post:
 *     summary: Create a new station
 *     tags: [Stations]
 *     requestBody:
 *       required: true
 *       description: The property city is optional
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               state:
 *                 type: string
 *               countryCode:
 *                 type: string
 *               coordinates:
 *                 type: object                 
 *                 properties:
 *                   longitude:
 *                     type: number
 *                   latitude:
 *                     type: number
 *               city:
 *                 type: string
 *               networkId:
 *                 type: string
 *               isVisibleToUser:
 *                 type: boolean
 *     responses:
 *       "200":
 *         description: A station schema
 *       "400":
 *         description: Bad request
 */

/**
 * @swagger
 * /api/stations/{id}:
 *   put:
 *     summary: Update a station by id
 *     tags: [Stations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: station id
 *     requestBody:
 *       required: true
 *       description: All properties are optional, except for the id.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               state:
 *                 type: string
 *               countryCode:
 *                 type: string
 *               coordinates:
 *                 type: object                 
 *                 properties:
 *                   longitude:
 *                     type: number
 *                   latitude:
 *                     type: number
 *               city:
 *                 type: string
 *               networkId:
 *                 type: string
 *               isVisibleToUser:
 *                 type: boolean
 *     responses:
 *       "200":
 *         description: Station updated successfully
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: Station not found
 */

/**
 * @swagger
 * /api/stations/{id}:
 *   delete:
 *     summary: Delete a station by id
 *     tags: [Stations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: station id
 *     responses:
 *       "200":
 *         description: Station deleted successfully
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: Station not found
 */