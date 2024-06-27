import { SubscriptionModel } from "../../data/mongo/models/subscription.model";
import { CreateSubscriptionDto, CustomError, PaginationDto, SubscriptionEntity } from "../../domain";
import { SharedService } from "./shared.service";
import { UpdateSubscriptionDto } from '../../domain/dtos/subscription/update-subscription.dto';

export class SubscriptionService {

    constructor (
        private readonly sharedService: SharedService,
    ) {}

    private async validateStationIds( stationIds: string[] ) {
        stationIds.forEach(stationId => {
            this.sharedService.validateId( stationId, `stationIds contains an invalid id: ${stationId}` );                    
        });

        await Promise.all(
            stationIds.map( stationId => this.sharedService.validateStationById(stationId) )
        );        
    }

    private async validateUserId( userId: string ) {
        this.sharedService.validateId(userId, 'Invalid userId'); // Regex validation
        await this.sharedService.validateUserById(userId); // DB validation existance
    }

    public async getSubscriptions( paginationDto: PaginationDto ) {
        const { page, limit } = paginationDto;
        try {
            const [ total, subscriptions ] = await Promise.all([
                SubscriptionModel.countDocuments(),
                SubscriptionModel.find()
                    .skip( (page - 1) * limit )
                    .limit( limit )
            ]);

            const subscriptionsObj = subscriptions.map( subscription => SubscriptionEntity.fromObj(subscription) );

            const totalPages = Math.ceil( total / limit );

            return {
                pagination: {
                    page: page,
                    limit: limit,
                    totalItems: total,
                    totalPages: totalPages,
                    next: (page < totalPages) ? `/api/subscriptions?page=${page + 1}&limit=${limit}` : null,
                    prev: (page - 1 > 0) ? `/api/subscriptions?page=${page - 1}&limit=${limit}` : null,
                    first: `/api/subscriptions?page=1&limit=${limit}`,
                    last: `/api/subscriptions?page=${totalPages}&limit=${limit}`,
                },
                subscriptions: subscriptionsObj
            }
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);                        
        }
    };

    public async getSubscriptionByUserId( userId: string ) {
        try {
            await this.validateUserId(userId);
            const subscription = await SubscriptionModel.findOne({ userId });            
            if (!subscription) throw CustomError.notFound(`No subscription found for userId: ${userId}`);

            return SubscriptionEntity.fromObj(subscription);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);
        }
    };

    public async getSubscriptionById( id: string ) {
        try {
            this.sharedService.validateId(id)
            const subscription = await SubscriptionModel.findById(id);
            if (!subscription) throw CustomError.notFound(`No subscription found for id: ${id}`);

            return SubscriptionEntity.fromObj(subscription);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);
        }
    };    

    public async createSubscription( createSubscriptionDto: CreateSubscriptionDto) {        
        try {
            await this.validateUserId(createSubscriptionDto.userId);

            const existsSubscription = await SubscriptionModel.findOne({ userId: createSubscriptionDto.userId });
            if (existsSubscription) throw CustomError.badRequest('Subscription already exists for this user');

            await this.validateStationIds(createSubscriptionDto.stationIds);
            // for (const stationId of createSubscriptionDto.stationIds) {
            //     await this.validateStationId(stationId);
            // }

            const subscription = new SubscriptionModel(createSubscriptionDto);
            await subscription.save();

            return SubscriptionEntity.fromObj(subscription);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);            
        }
    };

    public async updateSubscription( updateSubscriptionDto: UpdateSubscriptionDto) {
        const { id, ...updateOptions } = updateSubscriptionDto;
        try {            
            this.sharedService.validateId(id);
            if ( updateOptions.userId ) await this.validateUserId(updateOptions.userId);
            if ( updateOptions.stationIds ) await this.validateStationIds(updateOptions.stationIds);

            const subscription = await SubscriptionModel.findByIdAndUpdate({ _id: id }, updateOptions, { new: true });
            if (!subscription) throw CustomError.badRequest(`No subscription with id ${id} has been found`);

            return SubscriptionEntity.fromObj(subscription);            
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);            
        }
    };

    public async deleteSubscription( id: string ) {
        this.sharedService.validateId(id);
        try {
            const subscription = await SubscriptionModel.findByIdAndDelete(id);
            if (!subscription) throw CustomError.badRequest(`No subscription with id ${id} has been found`);
            return {
                message: `Subscription with id ${id} deleted`,
                subscription: SubscriptionEntity.fromObj(subscription)
            }
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);            
        }
    };

}