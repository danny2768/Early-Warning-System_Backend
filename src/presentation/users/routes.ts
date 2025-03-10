import { Router } from "express";
import { UsersController } from "./controller";
import { SharedService, UserService } from "../services";
import { AuthService } from '../services/auth.service';
import { EmailService } from '../services/email.service';
import { envs } from "../../config";
import { AuthMiddleware } from "../middlewares/auth.middleware";


export class UsersRoutes {
    
    static get routes(): Router {
        const router = Router();
        const sharedService = new SharedService();
        const emailService = new EmailService(
            envs.MAILER_SERVICE,
            envs.MAILER_EMAIL,
            envs.MAILER_SECRET_KEY,
            envs.SEND_EMAIL
        );
        const authService = new AuthService(emailService);
        const userService = new UserService(sharedService, authService);
        const controller = new UsersController( userService );

        router.get("/",       [ AuthMiddleware.validateAdminToken ], controller.getUsers);
        router.get("/self",   [ AuthMiddleware.validateUserToken ], controller.getSelf);
        router.get("/:id",    [ AuthMiddleware.validateSelfOrAdminToken ], controller.getUserById);
        router.post("/",      [ AuthMiddleware.validateAdminToken ], controller.createUser);
        router.put("/:id",    [ AuthMiddleware.validateSelfOrAdminToken ], controller.updateUser); 
        router.delete("/:id", [ AuthMiddleware.validateSelfOrSuperAdminToken ], controller.deleteUser);
        
        return router;
    }
}

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users resource
 */

/**
 * @swagger
 * /api/users:
 *  get:
 *      summary: Get all users
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: OK
 */

/**
 * @swagger
 * /api/users/self:
 *   get:
 *     summary: Get the current user's information
 *     tags: [Users]
 *     responses:
 *       "200":
 *         description: User information retrieved successfully
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: User not found
 */

/**
 * @swagger
 * /api/users/{id}:
 *  get:
 *      summary: Get a user by id
 *      tags: [Users]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: User id
 *      responses:
 *          200:
 *              description: OK
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       description: Phone property is optional
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: ['USER_ROLE', 'ADMIN_ROLE']
 *               phone:
 *                 type: object
 *                 properties:
 *                   countryCode:
 *                     type: string
 *                   number:
 *                     type: string
 * 
 *     responses:
 *       "200":
 *         description: A user schema
 *       "400":
 *         description: Bad request
 */

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User id
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: ['USER_ROLE', 'ADMIN_ROLE']
 *               phone:
 *                 type: object
 *                 properties:
 *                   countryCode:
 *                     type: string
 *                   number:
 *                     type: string
 *     responses:
 *       "200":
 *         description: User updated successfully
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: User not found
 */

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User id
 *     responses:
 *       "200":
 *         description: User deleted successfully
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: User not found
 */