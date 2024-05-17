import { CustomError } from "../errors/custom.errors";


export class ReadingEntity {

    constructor (
        public id: string,
        public value: number,
        public sensor: string,
        public sentAt: Date,
        public createdAt?: Date,
        public updatedAt?: Date,
    ) {}

    public static fromObj( object: { [key:string]: any }) {
        const { id, _id, value, sensor, sentAt, createdAt, updatedAt, } = object;

        if (!id && !_id) throw CustomError.badRequest("Missing id");
        if (!value) throw CustomError.badRequest("Missing value");
        if (!sensor) throw CustomError.badRequest("Missing sensor");                

        if (!sentAt) {
            throw CustomError.badRequest("Missing sentAt");            
        } else {
            let newSentAt;
            newSentAt = new Date(sentAt);
            if ( isNaN(newSentAt.getTime()) ) throw CustomError.badRequest("Invalid sentAt");
            object.dateCreated = newSentAt;            
        }
        
        return new ReadingEntity( id || _id, value, sensor, sentAt, createdAt, updatedAt, );
    }
}