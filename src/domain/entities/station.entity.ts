import { CountryAdapter } from "../../config";
import { CustomError } from "../errors/custom.errors";
import { Coordinates } from "../interfaces/coordinates.interface";


export class StationEntity {

    constructor(
        public id: string,
        public name: string,
        public state: string,
        public countryCode: string,
        public coordinates: Coordinates,
        public networkId: string,
        public isVisibleToUser: boolean,
        public city?: string,        
        public createdAt?: Date,
        public updatedAt?: Date,
    ) {}

    public static fromObj( object: { [key: string]: any }) {
        const { id, _id, name, state, countryCode, coordinates, networkId, isVisibleToUser, city, createdAt, updatedAt, } = object;

        if (!id && !_id) throw CustomError.badRequest("Missing id");
        if (!name) throw CustomError.badRequest("Missing name");
        if (!state) throw CustomError.badRequest("Missing state");
        
        if (!countryCode) throw CustomError.badRequest("Missing countryCode");
        if (!CountryAdapter.validateCountryCode(countryCode)) throw CustomError.badRequest("Invalid countryCode");

        if (!coordinates) throw CustomError.badRequest("Missing coordinates");
        
        if (!networkId) throw CustomError.badRequest("Missing networkId");

        if (!isVisibleToUser) throw CustomError.badRequest("Missing isVisibleToUser");
        
        // Non required properties
        // if (!city) throw CustomError.badRequest("Missing city");
        // if (!sensors) throw CustomError.badRequest("Missing sensors");

        return new StationEntity( id || _id, name, state, countryCode, coordinates, networkId, isVisibleToUser, city, createdAt, updatedAt, );
    }
}