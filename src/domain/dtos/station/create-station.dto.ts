import { Coordinates } from "../..";


export class CreateStationDto {

    private constructor(
        public readonly name: string,
        public readonly state: string,
        public readonly coordinates: Coordinates,
        public readonly city?: string,        
        public readonly networkId?: string,
    ) {}

    public static create(object: { [key: string]: any }): [ string?, CreateStationDto? ] {
        const { name, state, coordinates, city, networkId } = object;

        if (!name) return ['Property name is required']
        if (!state) return ['Property state is required']
        if (!coordinates) return ['Property coordinates is required']

        if (typeof coordinates !== 'object') {
            return ['Property coordinates must be an object'];
        };
    
        const { longitude, latitude, ...extraCoordinates } = coordinates;
    
        if (Object.keys(extraCoordinates).length > 0) {
            return ['Property coordinates has unexpected fields'];
        };
    
        if (typeof longitude !== 'number') {
            return ['Property coordinates.longitude is missing or not a number'];
        };
    
        if (typeof latitude !== 'number') {
            return ['Property coordinates.latitude is missing or not a number'];
        };
        

        return [undefined, new CreateStationDto( name, state, coordinates, city, networkId )];
    }
}