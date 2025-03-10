import { Request, Response } from "express";
import { CreateNetworkDto, CustomError, PaginationDto, UpdateNetworkDto } from "../../domain";
import { NetworkService } from "../services";


export class NetworksController {
    
    constructor(
        public readonly networkService: NetworkService
    ) {}

    private handleError = ( error: unknown, res: Response ) => {
        if (error instanceof CustomError) {
            return res.status( error.statusCode ).json({ error: error.message })
        }
        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal server error' })
    };

    public getNetworks = ( req: Request, res: Response ) => {
        const { page = 1, limit = 10 } = req.query;
        const [ error, paginationDto ] = PaginationDto.create( +page, +limit );
        if (error) return res.status(400).json({error});

        this.networkService.getNetworks( paginationDto! )
            .then( networks => res.json(networks) )
            .catch( error => this.handleError(error, res) );
    };

    public getNetworkById = ( req: Request, res: Response ) => {
        this.networkService.getNetworkById(req.params.id)
            .then( network => res.json(network) )
            .catch( error => this.handleError(error, res) );
    };

    public createNetwork = ( req: Request, res: Response ) => {
        const [error, createNetworkDto] = CreateNetworkDto.create(req.body);
        if (error) return res.status(400).json({error});            

        this.networkService.createNetwork( createNetworkDto! )
            .then( network => res.status(201).json(network) )
            .catch( error => this.handleError(error, res) );
    };

    public updateNetwork = ( req: Request, res: Response ) => {
        const id = req.params.id;
        const [error, updateNetworkDto] = UpdateNetworkDto.create({ ...req.body, id});
        if (error) return res.status(400).json({error});

        this.networkService.updateNetwork( updateNetworkDto! )
            .then( network => res.json(network) )
            .catch( error => this.handleError(error, res ));
    };

    public deleteNetwork = ( req: Request, res: Response ) => {
        this.networkService.deleteNetwork(req.params.id)
            .then( network => res.json(network) )
            .catch( error => this.handleError(error, res) );
    };


}