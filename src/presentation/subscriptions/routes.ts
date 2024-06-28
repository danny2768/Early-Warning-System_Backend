import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { SubscriptionsController } from "./controller";
import { SubscriptionService } from '../services/subscription.service';
import { SharedService } from "../services";


export class SubscriptionsRoutes {

    static get routes(): Router {
        const router = Router();
        const sharedService = new SharedService();
        const subscriptionService = new SubscriptionService(sharedService);
        const controller = new SubscriptionsController(subscriptionService);

        router.get("/",            [ AuthMiddleware.validateAdminToken ], controller.getSubscriptions);
        router.get("/by-user/:id", [ AuthMiddleware.validateSelfOrAdminToken ], controller.getSubscriptionByUserId);
        router.get("/:id",         [ AuthMiddleware.validateAdminToken ], controller.getSubscriptionById);
        router.post("/",           [ AuthMiddleware.validateUserToken ], controller.createSubscription); 
        router.put("/:id",         [ AuthMiddleware.validateUserToken ], controller.updateSubscription);
        router.delete("/:id",      [ AuthMiddleware.validateUserToken ], controller.deleteSubscription);

        // Extra validations are being made in the service for the create, update and delete methods.

        return router;
    }
}

/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: Subscriptions resource
 */

/**
 * @swagger
 * /api/subscriptions:
 *  get:
 *      summary: Get all subscriptions
 *      tags: [Subscriptions]
 *      responses:
 *          200:
 *              description: OK
 */

/**
 * @swagger
 * /api/subscriptions/by-user/{userId}:
 *  get:
 *      summary: Get a subscription by user id
 *      tags: [Subscriptions]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: user id
 *      responses:
 *          200:
 *              description: OK
 */

/**
 * @swagger
 * /api/subscriptions/{id}:
 *  get:
 *      summary: Get subscription by id
 *      tags: [Subscriptions]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: subscription id
 *      responses:
 *          200:
 *              description: OK
 */

/**
 * @swagger
 * /api/subscriptions:
 *   post:
 *     summary: Create a new subscription
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       description: Create subscription
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               stationIds:
 *                 type: array
 *                 items:
 *                  type: string
 *               contactMethods:
 *                 type: object                 
 *                 properties:
 *                   email:
 *                     type: boolean
 *                   whatsapp:
 *                     type: boolean
 *     responses:
 *       "200":
 *         description: A subscription schema
 *       "400":
 *         description: Bad request
 */

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   put:
 *     summary: Update a subscription by id
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: subscription id
 *     requestBody:
 *       required: true
 *       description: All properties are optional, except for the id.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               stationIds:
 *                 type: string[]
 *               contactMethods:
 *                 type: object                 
 *                 properties:
 *                   email:
 *                     type: boolean
 *                   whatsapp:
 *                     type: boolean
 *     responses:
 *       "200":
 *         description: Subscription updated successfully
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: Subscription not found
 */

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   delete:
 *     summary: Delete a subscription by id
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: subscription id
 *     responses:
 *       "200":
 *         description: Subscription deleted successfully
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: Subscription not found
 */