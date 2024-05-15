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