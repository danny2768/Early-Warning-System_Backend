import { CustomError } from "../errors/custom.errors";


export class NetworkEntity {

    constructor(
        public id: string,
        public name: string,
        public description?: string,
        public createdAt?: Date,
        public updatedAt?: Date,
    ) {}

    public static fromObj( object: { [key: string]: any }) {
        const { id, _id, name, description, createdAt, updatedAt, } = object;

        if (!id && !_id) throw CustomError.badRequest("Missing id");
        if (!name) throw CustomError.badRequest("Missing name");

        // Non required properties
        // if (!description) throw CustomError.badRequest("Missing description");

        return new NetworkEntity( id || _id, name, description, createdAt, updatedAt, );
    }
}