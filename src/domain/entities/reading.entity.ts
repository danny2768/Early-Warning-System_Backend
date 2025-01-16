import { CustomError } from "../errors/custom.errors";


export class ReadingEntity {

    constructor (
        public id: string,
        public value: number,
        public sensor: string,        
        public createdAt?: Date,
        public updatedAt?: Date,
    ) {}

    public static fromObj( object: { [key:string]: any }) {
        const { id, _id, value, sensor, createdAt, updatedAt, } = object;

        if (!id && !_id) throw CustomError.badRequest("Missing id");
        if (value === undefined || value === null) throw CustomError.badRequest("Missing value");
        if (!sensor) throw CustomError.badRequest("Missing sensor");                
        
        return new ReadingEntity( id || _id, value, sensor, createdAt, updatedAt, );
    }
}