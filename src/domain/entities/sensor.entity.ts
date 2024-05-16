import { CustomError } from "../errors/custom.errors";
import { Threshold } from "../interfaces/threshold.interface";
import { SensorType } from "../interfaces/types";


export class SensorEntity {

    constructor(
        public id: string,
        public name: string,
        public sensorType: SensorType,        
        public sendingInterval: number,
        public stationId: string,
        public threshold?: Threshold,
        public createdAt?: Date,
        public updatedAt?: Date,
    ) {}

    public static fromObj( object: { [key:string]: any }) {
        const { id, _id, name, sensorType, sendingInterval, stationId, threshold, createdAt, updatedAt, } = object; 

        if (!id && !_id) throw CustomError.badRequest("Missing id");
        if (!name) throw CustomError.badRequest("Missing name");            
        if (!sensorType) throw CustomError.badRequest("Missing sensorType");            
        if (!sendingInterval) throw CustomError.badRequest("Missing sendingInterval");
        if (!stationId) throw CustomError.badRequest("Missing stationId");
        // if (!threshold) throw CustomError.badRequest("Missing threshold");

        
        return new SensorEntity( id || _id, name, sensorType, sendingInterval, stationId, threshold, createdAt, updatedAt, );
    }
}