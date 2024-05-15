import { CustomError } from "../errors/custom.errors";
import { SensorType } from "../interfaces/types";


export class SensorEntity {

    constructor(
        public id: string,
        public name: string,
        public sensorType: SensorType,        
        public threshold: number,
        public sendingInterval: number,
        public stationId: string,
        public createdAt?: Date,
        public updatedAt?: Date,
    ) {}

    public static fromObj( object: { [key:string]: any }) {
        const { id, _id, name, sensorType, threshold, sendingInterval, stationId, createdAt, updatedAt, } = object; 

        if (!id && !_id) throw CustomError.badRequest("Missing id");
        if (!sensorType) throw CustomError.badRequest("Missing sensorType");            
        if (!name) throw CustomError.badRequest("Missing name");            

        if (!threshold) throw CustomError.badRequest("Missing threshold");
        if (!sendingInterval) throw CustomError.badRequest("Missing sendingInterval");
        if (!stationId) throw CustomError.badRequest("Missing stationId");
        
        return new SensorEntity( id || _id, name, sensorType, threshold, sendingInterval, stationId, createdAt, updatedAt, );
    }
}