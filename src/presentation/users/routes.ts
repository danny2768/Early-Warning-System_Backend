import { Router } from "express";
import { UsersController } from "./controller";
import { SharedService, UserService } from "../services";
import { AuthService } from '../services/auth.service';
import { EmailService } from '../services/email.service';
import { envs } from "../../config";


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

        router.get("/", controller.getUsers);
        router.get("/:id", controller.getUserById);

        router.post("/", controller.createUser);

        router.put("/:id", controller.updateUser); // It should be a PATCH request

        router.delete("/:id", controller.deleteUser);
        
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