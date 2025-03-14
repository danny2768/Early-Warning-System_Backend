import { regularExps } from "../../../config";
import { Phone } from "../../interfaces/phone.interface";
import { RoleType } from "../../interfaces/types";


export class CreateUserDto {

    private constructor(
        public readonly name: string,
        public readonly email: string,
        public readonly password: string,
        public readonly role?: RoleType[],
        public readonly phone?: Phone,
    ) {}

    public static create(object: { [key: string]: any }): [ string?, CreateUserDto? ] {

        const { name, email, password, role, phone } = object;

        if (!name) return ['Property name is required'];
        if (!email) return ['Property email is required'];
        if (!regularExps.email.test(email)) return ['email is not valid'];
        if (!password) return ['Property password is required'];
        if (password.length < 8) return ['Password must be at least 8 characters'];

        if (role) {
            if (!Array.isArray(role)) return ['Property role must be an array'];
            if (!role.every(r => ['SUPER_ADMIN_ROLE', 'ADMIN_ROLE', 'USER_ROLE'].includes(r))) return ['Invalid role'];
        }
        
        if (phone) {
            if (typeof phone !== 'object') return ['Property phone must be an object'];
            
            const { countryCode, number, ...extraPhone } = phone;

            if (Object.keys(extraPhone).length > 0) return ['Property phone has unexpected fields'];
            
            if (!countryCode) return ['Property phone.countryCode is required'];
            if (!number) return ['Property phone.number is required'];

            if (typeof countryCode !== 'string') return ['Property phone.countryCode must be a string'];
            if (typeof number !== 'string') return ['Property phone.number must be a string'];

            if (!regularExps.phone.countryCode.test(countryCode)) return ['Invalid phone.countryCode'];
            if (!regularExps.phone.number.test(number)) return ['Invalid phone.number'];
        }

        return [undefined, new CreateUserDto(name, email, password, role || ['USER_ROLE'], phone)];
    }
}
