import { CustomError } from "../errors/custom.errors";

export class UserEntity {
    
    constructor(
        public name: string,
        public email: string,
        public emailValidated: boolean,
        public password: string,
        public role: string,
        public dateCreated: Date,
        public lastUpdated: Date = new Date(),
    ) {}

    public static fromObj( object: { [key: string]: any }) {
        const { id, _id, name, email, emailValidated, password, role, dateCreated, lastUpdated } = object;

        if (!id && !_id) throw CustomError.badRequest("Missing id");
        if (!name) throw CustomError.badRequest("Missing name");
        if (!email) throw CustomError.badRequest("Missing email");
        if (emailValidated === undefined) throw CustomError.badRequest("Missing email validated");
        if (!password) throw CustomError.badRequest("Missing password");
        if (!role) throw CustomError.badRequest("Missing role");
        
        if (!dateCreated) {
            throw CustomError.badRequest("Missing dateCreated");
        } else {
            let newDateCreated;
            newDateCreated = new Date(dateCreated);
            if ( isNaN(newDateCreated.getTime()) ) throw CustomError.badRequest("Invalid dateCreated");        
            object.dateCreated = newDateCreated;            
        }

        if (lastUpdated) {
            let newlastUpdated;
            newlastUpdated = new Date(lastUpdated);
            if ( isNaN(newlastUpdated.getTime()) ) throw CustomError.badRequest("Invalid lastUpdated");
            object.lastUpdated = newlastUpdated;
        }

        return new UserEntity(name, email, emailValidated, password, role, dateCreated, lastUpdated);        
    }
}