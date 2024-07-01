import { CustomError } from "../errors/custom.errors";
import { ContactMethods } from "../interfaces/contact-methods.interface";


export class SubscriptionEntity {
    constructor(
        public id: string,
        public userId: string,
        public stationIds: string[],
        public contactMethods: ContactMethods,
        public createdAt?: Date,
        public updatedAt?: Date,
    ) {}

    public static fromObj( object: { [key: string]: any }) {
        const { id, _id, userId, stationIds, contactMethods, createdAt, updatedAt, } = object;

        if (!id && !_id) throw CustomError.badRequest("Missing id");
        if (!userId) throw CustomError.badRequest("Missing userId");
        if (!stationIds) throw CustomError.badRequest("Missing stationIds");
        if (!contactMethods) throw CustomError.badRequest("Missing contactMethods");

        return new SubscriptionEntity( id || _id, userId, stationIds, contactMethods, createdAt, updatedAt, );
    }
}