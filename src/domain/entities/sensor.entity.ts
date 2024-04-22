import { CustomError } from "../errors/custom.errors";


export class SensorEntity {

    constructor(
        public sensor: string,
        public value: number,
        public receivedAt: Date,
        public threshold: number,
        public sendingInterval: number,
    ) {}

    public static fromObj( object: { [key:string]: any }) {
        const { id, _id, sensor, value, receivedAt, Threshold, sendingInterval } = object

        if (!id && !_id) throw CustomError.badRequest("Missing id");
        if (!sensor) throw CustomError.badRequest("Missing sensor");
        if (!value) throw CustomError.badRequest("Missing value");
        
        if (!receivedAt) {
            throw CustomError.badRequest("Missing receivedAt");            
        } else {
            let newReceivedAt;
            newReceivedAt = new Date(receivedAt);
            if ( isNaN(newReceivedAt.getTime()) ) throw CustomError.badRequest("Invalid receivedAt");
            object.receivedAt = newReceivedAt;            
        }
        
        if (!Threshold) throw CustomError.badRequest("Missing Threshold");
        if (!sendingInterval) throw CustomError.badRequest("Missing sendingInterval");


        return new SensorEntity( sensor, value, receivedAt, Threshold, sendingInterval)
    }
}