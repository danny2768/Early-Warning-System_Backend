import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService, EmailService } from '../services';
import { envs } from '../../config';
import { AuthMiddleware } from '../middlewares/auth.middleware';


export class AuthRoutes {


  static get routes(): Router {

    const router = Router();
    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL
    );
    const authService = new AuthService( emailService );
    const controller = new AuthController( authService );
    
    router.post('/login', controller.loginUser );
    router.post('/register', controller.registerUser );
    router.get('/send-validation-email', [AuthMiddleware.validateAnyRoleToken], controller.sendValidationEmail );
    router.get('/validate-email/:token', controller.validateEmail );



    return router;
  }


}

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication resource
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       "200":
 *         description: A user schema
 */  

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
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
 *     responses:
 *       "200":
 *         description: A user schema
 */

/**
 * @swagger
 * /auth/send-validation-email:
 *   post:
 *     summary: Send a validation email to the user
 *     tags: [Authentication]
 *     responses:
 *       "200":
 *         description: Validation email sent successfully
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: User not found
 */

/**
 * @swagger 
 * /auth/validate-email/{token}:
 *   get:
 *     summary: Validate a user's email
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Email validation token
 *     responses:
 *       "200":
 *         description: A user schema
 */