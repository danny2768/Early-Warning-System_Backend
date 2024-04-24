import { CustomError } from "../errors/custom.errors";

export interface Coordinates {
    longitude: number,
    latitude: number,
}

export class StationEntity {

    constructor(
        public id: string,
        public name: string,
        public state: string,
        public coordinates: Coordinates,
        public city?: string,
        public sensors?: string[],
        public networkId?: string,
        public createdAt?: Date,
        public updatedAt?: Date,
    ) {}

    public static fromObj( object: { [key: string]: any }) {
        const { id, _id, name, state, coordinates, city, sensors, networkId, createdAt, updatedAt, } = object;

        if (!id && !_id) throw CustomError.badRequest("Missing id");
        if (!name) throw CustomError.badRequest("Missing name");
        if (!state) throw CustomError.badRequest("Missing state");
        if (!coordinates) throw CustomError.badRequest("Missing coordinates");
        
        // Non required properties
        // if (!city) throw CustomError.badRequest("Missing city");
        // if (!sensors) throw CustomError.badRequest("Missing sensors");
        // if (!networkId) throw CustomError.badRequest("Missing networkId");

        return new StationEntity( id || _id, name, state, coordinates, city, sensors, networkId, createdAt, updatedAt, );
    }
}