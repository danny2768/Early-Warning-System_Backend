import { Router } from "express";
import { NetworksController } from "./controller";
import { NetworkService, SharedService } from "../services";
import { AuthMiddleware } from "../middlewares/auth.middleware";


export class NetworksRoutes {

    static get routes(): Router {
        const router = Router();
        const sharedService = new SharedService();
        const networkService = new NetworkService(sharedService);
        const controller = new NetworksController(networkService);

        router.get("/",       [ AuthMiddleware.validateAdminToken ], controller.getNetworks);
        router.get("/:id",    [ AuthMiddleware.validateAdminToken ], controller.getNetworkById);
        router.post("/",      [ AuthMiddleware.validateAdminToken ], controller.createNetwork);
        router.put("/:id",    [ AuthMiddleware.validateAdminToken ], controller.updateNetwork);
        router.delete("/:id", [ AuthMiddleware.validateSuperAdminToken ], controller.deleteNetwork);
        
        return router;
    };
}

/**
 * @swagger
 * tags:
 *   name: Networks
 *   description: Networks resource
 */

/**
 * @swagger
 * /api/networks:
 *  get:
 *      summary: Get all networks
 *      tags: [Networks]
 *      responses:
 *          200:
 *              description: OK
 */

/**
 * @swagger
 * /api/networks/{id}:
 *  get:
 *      summary: Get network by id
 *      tags: [Networks]
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
 * /api/networks:
 *   post:
 *     summary: Create a new network
 *     tags: [Networks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       "200":
 *         description: A network schema
 *       "400":
 *         description: Bad request
 */

/**
 * @swagger
 * /api/networks/{id}:
 *   put:
 *     summary: Update a network by id
 *     tags: [Networks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: network id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       "200":
 *         description: Network updated successfully
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: Network not found
 */

/**
 * @swagger
 * /api/networks/{id}:
 *   delete:
 *     summary: Delete a network by id
 *     tags: [Networks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Network id
 *     responses:
 *       "200":
 *         description: Network deleted successfully
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: Network not found
 */