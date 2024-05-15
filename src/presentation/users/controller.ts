import { Request, Response } from "express";
import { CreateUserDto, CustomError, UpdateUserDto } from "../../domain";
import { UserService } from "../services";



export class UsersController {

    constructor(
        public readonly userService: UserService
    ) {}

    private handleError = ( error: unknown, res: Response ) => {
        if (error instanceof CustomError) {
            return res.status( error.statusCode ).json({ error: error.message })
        }
        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal server error' })
    };

    public getUsers = ( req: Request, res: Response ) => {
        this.userService.getUsers()
            .then( users => res.json(users) )
            .catch( error => this.handleError(error, res) );
    };
    
    public getUserById = ( req: Request, res: Response ) => {
        this.userService.getUserById(req.params.id)
            .then( user => res.json(user) )
            .catch( error => this.handleError(error, res) );
    };

    public createUser = ( req: Request, res: Response ) => {
        const [error, createUserDto] = CreateUserDto.create(req.body);
        if (error) return res.status(400).json({error});

        this.userService.createUser( createUserDto! )
            .then( user => res.status(201).json(user) )
            .catch(error => this.handleError(error, res));
    };

    public updateUser = ( req: Request, res: Response ) => {
        const id = req.params.id;
        const [error, updateUserDto] = UpdateUserDto.create({ ...req.body, id});
        if (error) return res.status(400).json({error});

        this.userService.updateUser( updateUserDto! )
            .then( user => res.json(user) )
            .catch(error => this.handleError(error, res));
    };
    
    public deleteUser = ( req: Request, res: Response ) => {
        this.userService.deleteUser(req.params.id)
            .then( user => res.json(user) )
            .catch( error => this.handleError(error, res) );
    };
}