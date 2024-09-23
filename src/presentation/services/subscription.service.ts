import { SubscriptionModel } from "../../data/mongo/models/subscription.model";
import { CreateSubscriptionDto, CustomError, PaginationDto, SubscriptionEntity, UserEntity } from "../../domain";
import { SharedService } from "./shared.service";
import { UpdateSubscriptionDto } from '../../domain/dtos/subscription/update-subscription.dto';
import mongoose from "mongoose";

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

    private async validateStationId( stationId: string ) {
        this.sharedService.validateId(stationId, 'Invalid stationId'); // Regex validation
        await this.sharedService.validateStationById(stationId); // DB validation existance
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

    public async createSubscription( createSubscriptionDto: CreateSubscriptionDto, currentUser: UserEntity ) {                
        try {            
            // Check if the user is an admin
            const isAdmin = currentUser.role.includes('SUPER_ADMIN_ROLE') || currentUser.role.includes('ADMIN_ROLE');

            // If the user is not an admin and the userId in the DTO does not match the currentUser's id, throw an error
            if (!isAdmin && createSubscriptionDto.userId !== currentUser.id) {
                throw CustomError.forbidden('You are not allowed to create a subscription for another user');
            }

            await this.validateUserId(createSubscriptionDto.userId);

            // Fetch the user details for whom the subscription is being created
            const userForSubscription = isAdmin ? await this.sharedService.getUserById(createSubscriptionDto.userId) : currentUser;
            
            // Validate email contact method
            if (createSubscriptionDto.contactMethods.email && !userForSubscription.emailValidated) {
                throw CustomError.badRequest('Email must be validated before activating email notifications');
            }
        
            // Validate WhatsApp contact method
            if (createSubscriptionDto.contactMethods.whatsapp && (!userForSubscription.phone || !userForSubscription.phone.number || !userForSubscription.phone.countryCode)) {
                throw CustomError.badRequest('A phone number must be added to your account to activate WhatsApp notifications');
            }            

            const existsSubscription = await SubscriptionModel.findOne({ userId: createSubscriptionDto.userId });
            if (existsSubscription) throw CustomError.badRequest('Subscription already exists for this user');

            await this.validateStationIds(createSubscriptionDto.stationIds);

            const subscription = new SubscriptionModel(createSubscriptionDto);
            await subscription.save();

            return SubscriptionEntity.fromObj(subscription);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);            
        }
    };

    public async updateSubscription( updateSubscriptionDto: UpdateSubscriptionDto, currentUser: UserEntity ) {
        const { id, ...updateOptions } = updateSubscriptionDto;
        try {     
            // Check if the user is an admin
            const isAdmin = currentUser.role.includes('SUPER_ADMIN_ROLE') || currentUser.role.includes('ADMIN_ROLE');
            
            this.sharedService.validateId(id);

            // Fetch the current subscription to check ownership for non-admin users 
            const checkSubscription = await SubscriptionModel.findById(id);
            if (!checkSubscription) throw CustomError.badRequest(`No subscription with id ${id} has been found`);            
            
            if (!isAdmin && checkSubscription.userId.toString() !== currentUser.id) {
                throw CustomError.forbidden('You are not allowed to update a subscription that does not belong to you');
            }
                                    
            if ( updateOptions.stationIds ) await this.validateStationIds(updateOptions.stationIds);

            if ( updateOptions.contactMethods) {                
                // Fetch the user details for whom the subscription is being updated
                const userForSubscription = await this.sharedService.getUserById( checkSubscription.userId.toString() );

                // Validate email contact method
                if (updateOptions.contactMethods.email && !userForSubscription.emailValidated) {
                    throw CustomError.badRequest('Email must be validated before activating email notifications');
                }
            
                // Validate WhatsApp contact method
                if (updateOptions.contactMethods.whatsapp && (!userForSubscription.phone || !userForSubscription.phone.number || !userForSubscription.phone.countryCode)) {
                    throw CustomError.badRequest('A phone number must be added to your account to activate WhatsApp notifications');
                }
            }

            const subscription = await SubscriptionModel.findByIdAndUpdate({ _id: id }, updateOptions, { new: true });
            if (!subscription) throw CustomError.badRequest(`No subscription with id ${id} has been found`);

            return SubscriptionEntity.fromObj(subscription);            
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);            
        }
    };

    public async deleteSubscription( id: string, currentUser: UserEntity ) {
        this.sharedService.validateId(id);
        try {
            // Check if the user is a super admin
            const isSuperAdmin = currentUser.role.includes('SUPER_ADMIN_ROLE')

            if (!isSuperAdmin) {
                // Fetch the subscription to check ownership for non-super-admin users
                const checkSubscription = await SubscriptionModel.findById(id);
                if (!checkSubscription) throw CustomError.badRequest(`No subscription with id ${id} has been found`);

                // If the user is not a super admin and tries to delete a subscription not belonging to them, throw an error
                if (checkSubscription.userId.toString() !== currentUser.id) throw CustomError.forbidden('You are not allowed to delete a subscription that does not belong to you');
            }

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

    public async removeStationFromSubscription(stationId: string, currentUser: UserEntity) {
        try {
            await this.validateStationId(stationId);

            const subscription = await SubscriptionModel.findOne({ userId: currentUser.id });
            if (!subscription) throw CustomError.badRequest(`No subscription found for user ${currentUser.id}`);

            const stationIndex = subscription.stationIds.indexOf(new mongoose.Types.ObjectId(stationId));
            if (stationIndex === -1) throw CustomError.badRequest(`Station ${stationId} not found in subscription`);

            subscription.stationIds.splice(stationIndex, 1);
            await subscription.save();

            return SubscriptionEntity.fromObj(subscription);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);
        }
    }

    public async addSubscription(stationId: string, currentUser: UserEntity) {
        try {
            await this.validateStationId(stationId);

            // Check if the user has a phone number
            // Check if phone is undefined, null, or an empty object
            if (!currentUser.phone || Object.keys(currentUser.phone).length === 0) {
                throw CustomError.badRequest('User does not have a phone number');
            }

            // Ensure that both countryCode and number are present
            if (!currentUser.phone.countryCode || !currentUser.phone.number) {
                throw CustomError.badRequest('User does not have a valid phone number');
            }

            
            let subscription = await SubscriptionModel.findOne({ userId: currentUser.id });
            let subscriptionObj = subscription ? SubscriptionEntity.fromObj(subscription) : null;

            if (!subscription) {
                // Create a new subscription if it doesn't exist
                const [error, createSubscriptionDto] = CreateSubscriptionDto.create({
                    userId: currentUser.id,
                    stationIds: [stationId],
                    contactMethods: {
                        email: true,
                        whatsapp: true,
                    }
                });

                if (error) throw CustomError.badRequest(error);

                subscription = new SubscriptionModel(createSubscriptionDto);
                await subscription.save();
            } else {
                // Add the station to the existing subscription
                if (subscriptionObj && !subscriptionObj.stationIds.includes(stationId)) {
                    subscription.stationIds.push(new mongoose.Types.ObjectId(stationId));
                    await subscription.save();
                }
            }

            return SubscriptionEntity.fromObj(subscription);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);
        }
    }
}