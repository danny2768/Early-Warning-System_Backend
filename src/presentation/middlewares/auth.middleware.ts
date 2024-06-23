import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";

export class AuthMiddleware {
    constructor() {}

    private static async validateTokenWithRole(req: Request, res: Response, next: NextFunction, roles: string[]) {
        const authorization = req.header('Authorization');
        if (!authorization) return res.status(401).json({ error: 'Unauthorized. No token provided' });

        if (!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized. Invalid Bearer token' });

        const token = authorization.split(' ').at(1) || '';

        try {
            const payload = await JwtAdapter.verifyToken<{ id: string }>(token);
            if (!payload) return res.status(401).json({ error: 'Unauthorized. Invalid token' });

            const user = await UserModel.findById(payload.id);
            if (!user) return res.status(401).json({ error: 'Unauthorized. Invalid token' });

            if (!roles.some(role => user.role.includes(role))) return res.status(403).json({ error: 'Forbidden. You dont have permission to access this resource' });

            req.body.user = UserEntity.fromObj(user);

            next();
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async validateSuperAdminToken(req: Request, res: Response, next: NextFunction) {
        await AuthMiddleware.validateTokenWithRole(req, res, next, ['SUPER_ADMIN_ROLE']);
    }

    static async validateAdminToken(req: Request, res: Response, next: NextFunction) {
        await AuthMiddleware.validateTokenWithRole(req, res, next, ['ADMIN_ROLE', 'SUPER_ADMIN_ROLE']);
    }

    static async validateUserToken(req: Request, res: Response, next: NextFunction) {
        await AuthMiddleware.validateTokenWithRole(req, res, next, ['USER_ROLE']);
    }    
}