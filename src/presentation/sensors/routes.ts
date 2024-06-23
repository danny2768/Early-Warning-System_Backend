import { Router } from "express";
import { SensorsController } from "./controller";
import { SensorService, SharedService } from "../services";
import { AuthMiddleware } from "../middlewares/auth.middleware";


export class SensorsRoutes {

    static get routes(): Router {
        const router = Router();
        const sharedService = new SharedService();
        const sensorService = new SensorService(sharedService);
        const controller = new SensorsController(sensorService);

        router.get("/",               [ AuthMiddleware.validateAdminToken ], controller.getSensors);
        router.get("/by-station/:id", [ AuthMiddleware.validateAdminToken ], controller.getSensorByStationId);
        router.get("/:id/readings",   [ AuthMiddleware.validateAdminToken ], controller.getSensorReadings);
        router.get("/:id",            [ AuthMiddleware.validateAdminToken ], controller.getSensorById);
        router.post("/",              [ AuthMiddleware.validateAdminToken ], controller.createSensor);
        router.put("/:id",            [ AuthMiddleware.validateAdminToken ], controller.updateSensor);
        router.delete("/:id",         [ AuthMiddleware.validateSuperAdminToken ], controller.deleteSensor);
        
        return router;
    };
}

/**
 * @swagger
 * tags:
 *   name: Sensors
 *   description: Sensors resource
 */

/**
 * @swagger
 * /api/sensors:
 *  get:
 *      summary: Get all sensors
 *      tags: [Sensors]
 *      responses:
 *          200:
 *              description: OK
 */

/**
 * @swagger
 * /api/sensors/by-station/{stationId}:
 *  get:
 *      summary: Get sensors by station id
 *      tags: [Sensors]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Satation id
 *      responses:
 *          200:
 *              description: OK
 */

/**
 * @swagger
 * /api/sensors/{id}/readings:
 *  get:
 *      summary: Get sensor by id w/ readings
 *      tags: [Sensors]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Sensor id
 *      responses:
 *          200:
 *              description: OK
 */

/**
 * @swagger
 * /api/sensors/{id}:
 *  get:
 *      summary: Get sensor by id
 *      tags: [Sensors]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Sensor id
 *      responses:
 *          200:
 *              description: OK
 */

/**
 * @swagger
 * /api/sensors:
 *   post:
 *     summary: Create a new sensor
 *     tags: [Sensors]
 *     requestBody:
 *       description: Note - threshold property is only required if sensorType is level
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               sensorType:
 *                 type: string
 *                 enum: ['level', 'flow', 'rain']
 *               sendingInterval:
 *                 type: number
 *               stationId:
 *                 type: string
 *               threshold:
 *                 type: object                 
 *                 properties:
 *                   yellow:
 *                     type: number
 *                   orange:
 *                     type: number
 *                   red:
 *                     type: number
 *     responses:
 *       "200":
 *         description: A user schema
 *       "400":
 *         description: Bad request
 */

/**
 * @swagger
 * /api/sensors/{id}:
 *   put:
 *     summary: Update a sensor by id
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Sensor id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               sensorType:
 *                 type: string
 *                 enum: ['level', 'flow', 'rain']
 *               sendingInterval:
 *                 type: number
 *               stationId:
 *                 type: string
 *               threshold:
 *                 type: object                 
 *                 properties:
 *                   yellow:
 *                     type: number
 *                   orange:
 *                     type: number
 *                   red:
 *                     type: number
 *     responses:
 *       "200":
 *         description: Sensor updated successfully
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: Sensor not found
 */

/**
 * @swagger
 * /api/sensors/{id}:
 *   delete:
 *     summary: Delete a sensor by id
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Sensor id
 *     responses:
 *       "200":
 *         description: Sensor updated successfully
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: Sensor not found
 */