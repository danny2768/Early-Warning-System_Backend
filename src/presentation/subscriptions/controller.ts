import { Request, Response } from "express";
import { CreateSubscriptionDto, CustomError, PaginationDto, UpdateSubscriptionDto } from "../../domain";
import { SubscriptionService } from "../services/subscription.service";

export class SubscriptionsController {

    constructor (
        public readonly subscriptionService: SubscriptionService,
    ) {}

    private handleError = ( error: unknown, res: Response ) => {
        if (error instanceof CustomError) {
            return res.status( error.statusCode ).json({ error: error.message })
        }
        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal server error' })
    };

    public getSubscriptions = ( req: Request, res: Response ) => {
        const { page = 1, limit = 10 } = req.query;
        const [ error, paginationDto ] = PaginationDto.create( +page, +limit );
        if (error) return res.status(400).json({error});

        this.subscriptionService.getSubscriptions( paginationDto! )
            .then( subscriptions => res.json(subscriptions) )
            .catch( error => this.handleError(error, res) );
    };

    public getSubscriptionByUserId = ( req: Request, res: Response ) => {
        this.subscriptionService.getSubscriptionByUserId(req.params.id)
            .then( subscription => res.json(subscription) )
            .catch( error => this.handleError(error, res) );
    };

    public getSubscribedStations = (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [ error, paginationDto ] = PaginationDto.create( +page, +limit );
        if (error) return res.status(400).json({error});

        const currentUser = req.body.user;

        this.subscriptionService.getSubscribedStations(currentUser, paginationDto!)
            .then(stations => res.json(stations))
            .catch(error => this.handleError(error, res));
    };

    public getSubscriptionById = ( req: Request, res: Response ) => {
        this.subscriptionService.getSubscriptionById(req.params.id)
            .then( subscription => res.json(subscription) )
            .catch( error => this.handleError(error, res) );
    };    

    public createSubscription = ( req: Request, res: Response ) => {
        const [error, createSubscriptionDto] = CreateSubscriptionDto.create(req.body);
        if (error) return res.status(400).json({error});

        const currentUser = req.body.user;

        this.subscriptionService.createSubscription( createSubscriptionDto!, currentUser )
            .then( subscription => res.json(subscription) )
            .catch( error => this.handleError(error, res) );
    };

    public updateSubscription = ( req: Request, res: Response ) => {
        const id = req.params.id;
        const [error, updateSubscriptionDto] = UpdateSubscriptionDto.create({ ...req.body, id });
        if (error) return res.status(400).json({error});

        const currentUser = req.body.user;

        this.subscriptionService.updateSubscription( updateSubscriptionDto!, currentUser )
            .then( subscription => res.json(subscription) )
            .catch( error => this.handleError(error, res) );
    };

    public deleteSubscription = ( req: Request, res: Response ) => {
        const currentUser = req.body.user;

        this.subscriptionService.deleteSubscription( req.params.id, currentUser)
            .then( subscription => res.json(subscription) )
            .catch( error => this.handleError(error, res) );
    };

    public removeStationFromSubscription = (req: Request, res: Response) => {
        const stationId = req.params.id;
        const currentUser = req.body.user;

        this.subscriptionService.removeStationFromSubscription(stationId, currentUser)
            .then(subscription => res.json(subscription))
            .catch(error => this.handleError(error, res));
    };

    public addSubscription = (req: Request, res: Response) => {
        const { stationId } = req.body;
        const currentUser = req.body.user;

        this.subscriptionService.addSubscription(stationId, currentUser)
            .then(subscription => res.json(subscription))
            .catch(error => this.handleError(error, res));
    };
    
}