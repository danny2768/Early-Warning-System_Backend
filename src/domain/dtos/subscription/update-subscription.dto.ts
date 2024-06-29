import { ContactMethods } from "../../interfaces/contact-methods.interface";

export class UpdateSubscriptionDto {

    private constructor(
        public readonly id: string,        
        public readonly stationIds?: string[],
        public readonly contactMethods?: ContactMethods,
    ) {}

    public static create(object: { [key: string]: any }): [ string?, UpdateSubscriptionDto? ] {
        const { id, stationIds, contactMethods } = object;

        if (!id) return ['Property id is required']        
        if (typeof id !== 'string') return ['id property must be a string'];
        if (id.trim() === '') return ['id property must be a non-empty string'];
        
        if (stationIds) {
            if (!Array.isArray(stationIds)) return ['Property stationIds must be an array'];
            if (stationIds.some(id => typeof id !== 'string')) return ['Property stationIds must be an array of strings'];
        };

        if (contactMethods) {
            if (typeof contactMethods !== 'object') return ['Property contactMethods must be an object'];
            if (Object.keys(contactMethods).length === 0) return ['Property contactMethods must not be empty'];

            const { email, whatsapp, ...extraContactMethods } = contactMethods;

            if (Object.keys(extraContactMethods).length > 0) return ['Property contactMethods has unexpected fields'];
            if (typeof email !== 'boolean') return ['Property contactMethods.email is missing or not a boolean'];
            if (typeof whatsapp !== 'boolean') return ['Property contactMethods.whatsapp is missing or not a boolean'];
        };

        return [undefined, new UpdateSubscriptionDto(id, stationIds, contactMethods)];
    }
}