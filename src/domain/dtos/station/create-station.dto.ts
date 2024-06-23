import { Coordinates } from "../..";
import { CountryCodeAdapter } from "../../../config";


export class CreateStationDto {

    private constructor(
        public readonly name: string,
        public readonly state: string,
        public readonly countryCode: string,
        public readonly coordinates: Coordinates,
        public readonly networkId: string,
        public readonly isVisibleToUser: boolean,
        public readonly city?: string,        
    ) {}

    public static create(object: { [key: string]: any }): [ string?, CreateStationDto? ] {
        const { name, state, countryCode, coordinates, networkId, isVisibleToUser, city } = object;

        if (!name) return ['Property name is required'];
        if (!state) return ['Property state is required']; // TODO: check if state is a valid state name
        
        if (!countryCode) return ['Property countryCode is required'];
        if (typeof countryCode !== 'string') return ['Property countryCode must be a string'];        
        if (countryCode.length < 2 || countryCode.length > 3) return ['Invalid countryCode'];
        if (!CountryCodeAdapter.validateCountryCode(countryCode)) return ['Invalid countryCode'];

        if (!coordinates) return ['Property coordinates is required'];

        if (typeof coordinates !== 'object') return ['Property coordinates must be an object'];
        
        const { longitude, latitude, ...extraCoordinates } = coordinates;
        if (Object.keys(extraCoordinates).length > 0) return ['Property coordinates has unexpected fields'];
        if (typeof longitude !== 'number') return ['Property coordinates.longitude is missing or not a number'];
        if (typeof latitude !== 'number') return ['Property coordinates.latitude is missing or not a number'];

        if(!networkId) return ['Property networkId is required'];
        
        if (!isVisibleToUser) return ['Property isVisibleToUser is required & must be a boolean'];
        let isVisibleToUserBool: boolean;
        if (typeof isVisibleToUser === 'boolean') {
            isVisibleToUserBool = isVisibleToUser;
        } else if (typeof isVisibleToUser === 'string') {
            if (isVisibleToUser.toLowerCase() === 'true') {
                isVisibleToUserBool = true;
            } else if (isVisibleToUser.toLowerCase() === 'false') {
                isVisibleToUserBool = false;
            } else {
                return ['Property isVisibleToUser must be a boolean or a string that represents a boolean'];
            }
        } else {
            return ['Property isVisibleToUser must be a boolean'];
        }
        
        if (city) { // TODO: check if city is a valid state city
            if (typeof city !== 'string') return ['city property must be a string'];
            if (city.trim() === '') return ['city property must be a non-empty string'];
        };

        return [undefined, new CreateStationDto( name, state, countryCode.toUpperCase(), coordinates, networkId, isVisibleToUserBool, city )];
    }
}