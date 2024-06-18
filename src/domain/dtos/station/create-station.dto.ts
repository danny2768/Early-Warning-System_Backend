import { Coordinates } from "../..";
import { CountryCodeAdapter } from "../../../config";


export class CreateStationDto {

    private constructor(
        public readonly name: string,
        public readonly state: string,
        public readonly countryCode: string,
        public readonly coordinates: Coordinates,
        public readonly networkId: string,
        public readonly city?: string,        
    ) {}

    public static create(object: { [key: string]: any }): [ string?, CreateStationDto? ] {
        const { name, state, countryCode, coordinates, city, networkId } = object;

        if (!name) return ['Property name is required'];
        if (!state) return ['Property state is required']; // TODO: check if state is a valid state name
        
        if (!countryCode) return ['Property countryCode is required'];
        if (countryCode.length > 3) return ['Invalid countryCode'];
        if (!CountryCodeAdapter.validateCountryCode(countryCode)) return ['Invalid countryCode'];

        if (!coordinates) return ['Property coordinates is required'];

        if (typeof coordinates !== 'object') return ['Property coordinates must be an object'];
        
        const { longitude, latitude, ...extraCoordinates } = coordinates;
        if (Object.keys(extraCoordinates).length > 0) return ['Property coordinates has unexpected fields'];
        if (typeof longitude !== 'number') return ['Property coordinates.longitude is missing or not a number'];
        if (typeof latitude !== 'number') return ['Property coordinates.latitude is missing or not a number'];

        if(!networkId) return ['Property networkId is required'];

        if (city) { // TODO: check if city is a valid state city
            if (typeof city !== 'string') return ['city property must be a string'];
            if (city.trim() === '') return ['city property must be a non-empty string'];
        };

        return [undefined, new CreateStationDto( name, state, countryCode, coordinates, city, networkId )];
    }
}