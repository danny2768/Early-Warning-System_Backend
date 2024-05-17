import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";


export class AuthMiddleware {

    constructor() {}

    static async validateAdminToken( req: Request, res: Response, next: NextFunction ) {
        const authorization = req.header('Authorization');
        if (!authorization) return res.status(401).json({ error: 'Unauthorized. No token provided' }); 

        if (!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized. Invalid Bearer token' });

        const token = authorization.split(' ').at(1) || '';

        try {
            const payload = await JwtAdapter.verifyToken<{ id: string }>(token);
            if (!payload) return res.status(401).json({ error: 'Unauthorized. Invalid token' });

            const user = await UserModel.findById( payload.id );
            if (!user) return res.status(401).json({ error: 'Unauthorized. Invalid token' });
            
            if (!user.role.includes('ADMIN_ROLE')) return res.status(403).json({ error: 'Forbidden. You dont have permission to access this resource' });

            req.body.user = UserEntity.fromObj(user);

            next();

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    
    }

    
    static async validateToken( req: Request, res: Response, next: NextFunction ) {
        const authorization = req.header('Authorization');
        if (!authorization) return res.status(401).json({ error: 'Unauthorized. No token provided' }); 

        if (!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized. Invalid Bearer token' });

        const token = authorization.split(' ').at(1) || '';

        try {
            const payload = await JwtAdapter.verifyToken<{ id: string }>(token);
            if (!payload) return res.status(401).json({ error: 'Unauthorized. Invalid token' });

            const user = await UserModel.findById( payload.id );
            if (!user) return res.status(401).json({ error: 'Unauthorized. Invalid token' });
            
            if (!user.role.includes('ADMIN_ROLE') && !user.role.includes('USER_ROLE')) return res.status(401).json({ error: 'Unauthorized. Invalid token' });

            req.body.user = UserEntity.fromObj(user);

            next();

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}