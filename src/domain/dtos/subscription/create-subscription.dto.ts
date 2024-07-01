import { ContactMethods } from "../../interfaces/contact-methods.interface";

export class CreateSubscriptionDto {
    
    private constructor (
        public readonly userId: string,
        public readonly stationIds: string[],
        public readonly contactMethods: ContactMethods,
    ) {}

    public static create(object: { [key: string]: any }): [ string?, CreateSubscriptionDto? ] {
        const { userId, stationIds, contactMethods } = object;

        if (!userId) return ['Property userId is required'];
        if (typeof userId !== 'string') return ['userId property must be a string'];
        if (userId.trim() === '') return ['userId property must be a non-empty string'];

        if (!stationIds) return ['Property stationIds is required'];
        if (!Array.isArray(stationIds)) return ['Property stationIds must be an array'];
        if (stationIds.length === 0) return ['Property stationIds must not be empty'];
        if (stationIds.some(id => typeof id !== 'string')) return ['Property stationIds must be an array of strings'];

        if (!contactMethods) return ['Property contactMethods is required'];
        if (typeof contactMethods !== 'object') return ['Property contactMethods must be an object'];
        if (Object.keys(contactMethods).length === 0) return ['Property contactMethods must not be empty'];

        const { email, whatsapp, ...extraContactMethods } = contactMethods;

        if (Object.keys(extraContactMethods).length > 0) return ['Property contactMethods has unexpected fields'];
        if (typeof email !== 'boolean') return ['Property contactMethods.email is missing or not a boolean'];
        if (typeof whatsapp !== 'boolean') return ['Property contactMethods.whatsapp is missing or not a boolean'];

        return [undefined, new CreateSubscriptionDto(userId, stationIds, contactMethods)];
    }
}