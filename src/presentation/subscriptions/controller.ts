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

    public getSubscriptionById = ( req: Request, res: Response ) => {
        this.subscriptionService.getSubscriptionById(req.params.id)
            .then( subscription => res.json(subscription) )
            .catch( error => this.handleError(error, res) );
    };    

    public createSubscription = ( req: Request, res: Response ) => {
        const [error, createSubscriptionDto] = CreateSubscriptionDto.create(req.body);
        if (error) return res.status(400).json({error});

        this.subscriptionService.createSubscription( createSubscriptionDto! )
            .then( subscription => res.json(subscription) )
            .catch( error => this.handleError(error, res) );
    };

    public updateSubscription = ( req: Request, res: Response ) => {
        const id = req.params.id;
        const [error, updateSubscriptionDto] = UpdateSubscriptionDto.create({ ...req.body, id });
        if (error) return res.status(400).json({error});

        this.subscriptionService.updateSubscription( updateSubscriptionDto! )
            .then( subscription => res.json(subscription) )
            .catch( error => this.handleError(error, res) );
    };

    public deleteSubscription = ( req: Request, res: Response ) => {
        this.subscriptionService.deleteSubscription(req.params.id)
            .then( subscription => res.json(subscription) )
            .catch( error => this.handleError(error, res) );
    };

    
}