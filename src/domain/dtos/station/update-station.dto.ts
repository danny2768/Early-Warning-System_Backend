import { Coordinates } from "../..";
import { CountryAdapter } from "../../../config";


export class UpdateStationDto {
    
    private constructor(
        public readonly id: string,
        public readonly name?: string,
        public readonly state?: string,
        public readonly countryCode?: string,
        public readonly coordinates?: Coordinates,
        public readonly city?: string,
        public readonly networkId?: string,
        public readonly isVisibleToUser?: boolean,
    ) {}

    public static create(object: { [key: string]: any }): [ string?, UpdateStationDto? ] {
        const { id, name, state, countryCode, coordinates, city, networkId, isVisibleToUser } = object;

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
            if (!CountryAdapter.validateCountryCode(countryCode)) return ['Invalid countryCode'];
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

        let isVisibleToUserBool: boolean = true;
        if (isVisibleToUser) {
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
        }

        return [undefined, new UpdateStationDto( id, name, state, countryCode, coordinates, city, networkId, isVisibleToUserBool )];
    }
}