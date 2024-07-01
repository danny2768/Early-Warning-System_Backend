import { CustomError } from "../errors/custom.errors";
import { Phone } from "../interfaces/phone.interface";
import { RoleType } from "../interfaces/types";

export class UserEntity {
    
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public emailValidated: boolean,
        public password: string,
        public role: RoleType[],
        public phone?: Phone,
        public createdAt?: Date,
        public updatedAt?: Date,
    ) {}

    public static fromObj( object: { [key: string]: any }) {
        const { id, _id, name, email, emailValidated, password, role, phone, createdAt, updatedAt, } = object;

        if (!id && !_id) throw CustomError.badRequest("Missing id");
        if (!name) throw CustomError.badRequest("Missing name");
        if (!email) throw CustomError.badRequest("Missing email");
        if (emailValidated === undefined) throw CustomError.badRequest("Missing email validated");
        if (!password) throw CustomError.badRequest("Missing password");
        if (!role) throw CustomError.badRequest("Missing role");                    

        return new UserEntity( id || _id, name, email, emailValidated, password, role, phone, createdAt, updatedAt, );        
    }
}