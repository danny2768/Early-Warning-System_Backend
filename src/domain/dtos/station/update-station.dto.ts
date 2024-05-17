import { Coordinates } from "../..";
import { CountryCodeAdapter } from "../../../config";


export class UpdateStationDto {
    
    private constructor(
        public readonly id: string,
        public readonly name?: string,
        public readonly state?: string,
        public readonly countryCode?: string,
        public readonly coordinates?: Coordinates,
        public readonly city?: string,
        public readonly networkId?: string,
    ) {}

    public static create(object: { [key: string]: any }): [ string?, UpdateStationDto? ] {
        const { id, name, state, countryCode, coordinates, city, networkId } = object;

        if (!id) return ['Property id is required']        
        if (typeof id !== 'string') return ['id property must be a string'];
        if (id.trim() === '') return ['id property must be a non-empty string'];

        if (name) {
            if (typeof name !== 'string') return ['name property must be a string'];
            if (name.trim() === '') return ['name property must be a non-empty string'];
        };

        if (state) { // TODO: check if state is a valid state name
            if (typeof state !== 'string') return ['state property must be a string'];
            if (state.trim() === '') return ['state property must be a non-empty string'];
        };

        if (countryCode) {
            if (typeof countryCode !== 'string') return ['countryCode property must be a string'];
            if (countryCode.trim() === '') return ['countryCode property must be a non-empty string'];
            if (!CountryCodeAdapter.validateCountryCode(countryCode)) return ['Invalid countryCode'];
        };

        if (coordinates) {
            if (typeof coordinates !== 'object') return ['Property coordinates must be an object'];
            if (Object.keys(coordinates).length === 0) return ['Property coordinates must not be empty'];

            const { longitude, latitude, ...extraCoordinates } = coordinates;

            if (Object.keys(extraCoordinates).length > 0) return ['Property coordinates has unexpected fields'];
            if (typeof longitude !== 'number') return ['Property coordinates.longitude is missing or not a number'];        
            if (typeof latitude !== 'number') return ['Property coordinates.latitude is missing or not a number'];    
        };

        if (city) { // TODO: check if city is a valid city name
            if (typeof city !== 'string') return ['city property must be a string'];
            if (city.trim() === '') return ['city property must be a non-empty string'];
        };

        return [undefined, new UpdateStationDto( id, name, state, countryCode, coordinates, city, networkId )];
    }
}