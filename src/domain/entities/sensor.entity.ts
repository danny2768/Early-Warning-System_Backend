import { CustomError } from "../errors/custom.errors";


export class SensorEntity {

    constructor(
        public id: string,
        public name: string,
        public sensor: string,        
        public threshold: number,
        public sendingInterval: number,
        public stationId: string,
        public readings?: string[],
        public createdAt?: Date,
        public updatedAt?: Date,
    ) {}

    public static fromObj( object: { [key:string]: any }) {
        const { id, _id, name, sensor, threshold, sendingInterval, stationId, readings, createdAt, updatedAt, } = object; 

        if (!id && !_id) throw CustomError.badRequest("Missing id");
        if (!sensor) throw CustomError.badRequest("Missing sensor");            
        if (!name) throw CustomError.badRequest("Missing name");            

        if (!threshold) throw CustomError.badRequest("Missing threshold");
        if (!sendingInterval) throw CustomError.badRequest("Missing sendingInterval");
        if (!stationId) throw CustomError.badRequest("Missing stationId");

        // Non required properties
        // if (!readings) throw CustomError.badRequest("Missing readings");
        
        return new SensorEntity( id || _id, name, sensor, threshold, sendingInterval, stationId, readings, createdAt, updatedAt, );
    }
}