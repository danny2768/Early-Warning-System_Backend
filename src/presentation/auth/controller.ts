import { Request, Response } from "express";
import { AuthService } from "../services";
import { CustomError, LoginUserDto, RegisterUserDto } from "../../domain";

export class AuthController {

    constructor(
        public readonly authService: AuthService,
    ) {}

    private handleError = ( error: unknown, res: Response ) => {
        if (error instanceof CustomError) {
            return res.status( error.statusCode ).json({ error: error.message })
        }
        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal server error' })
    };

    registerUser = ( req: Request, res: Response ) => {
        const [error, registerDto] = RegisterUserDto.create(req.body);
        if (error) return res.status(400).json({error});

        this.authService.registerUser( registerDto! )
            .then( user => res.status(201).json( user ) )
            .catch( error => this.handleError(error, res) );
    };
    
    loginUser = ( req: Request, res: Response ) => {
        const [error, loginUserDto] = LoginUserDto.create(req.body);
        if (error) return res.status(400).json({error});
        
        this.authService.logingUser( loginUserDto! )
            .then( user => res.json( user ) )
            .catch( error => this.handleError(error, res) );
    };

    sendValidationEmail = ( req: Request, res: Response ) => {
        const user = req.body.user;

        this.authService.sendValidationEmail( user )
            .then( () => res.json('Validation email was sent') )
            .catch( error => this.handleError(error, res) );
    };
    
    validateEmail = ( req: Request, res: Response ) => {
        const { token } = req.params;

        this.authService.validateEmail( token )
            .then( () => res.json('Email was validated properly') )
            .catch( error => this.handleError(error, res) );        
    };
}