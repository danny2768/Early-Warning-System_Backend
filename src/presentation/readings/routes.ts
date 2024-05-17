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

/**
 * @swagger
 * tags:
 *   name: Readings
 *   description: Readings resource
 */

/**
 * @swagger
 * /api/readings:
 *  get:
 *      summary: Get all readings
 *      tags: [Readings]
 *      responses:
 *          200:
 *              description: OK
 */

/**
 * @swagger
 * /api/readings:
 *   post:
 *     summary: Create a new reading
 *     tags: [Readings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: string
 *               sensor:
 *                 type: string
 *               sentAt:
 *                 type: string
 *     responses:
 *       "200":
 *         description: A reading schema
 *       "400":
 *         description: Bad request
 */

/**
 * @swagger
 * /api/readings/{id}:
 *   put:
 *     summary: Update a reading by id
 *     tags: [Readings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Reading id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: string
 *               sensor:
 *                 type: string
 *               sentAt:
 *                 type: string
 *     responses:
 *       "200":
 *         description: A reading schema
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: Reading not found
 */

/**
 * @swagger
 * /api/readings/{id}:
 *   delete:
 *     summary: Delete a reading by id
 *     tags: [Readings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User id
 *     responses:
 *       "200":
 *         description: Reading deleted successfully
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: Reading not found
 */