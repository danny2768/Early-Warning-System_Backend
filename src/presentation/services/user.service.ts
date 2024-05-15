import { AuthService, SharedService } from ".";
import { CreateUserDto, CustomError, UpdateUserDto, UserEntity } from "../../domain";
import { UserModel } from "../../data";




export class UserService {

    constructor(
        private readonly sharedService: SharedService,
        private readonly authService: AuthService,
    ) {}

    public async getUsers() {
        try {
            const users = await UserModel.find();            
            return users.map(user => UserEntity.fromObj(user));
        } catch (error) {
            throw CustomError.internalServer(`${error}`);            
        }
    };

    public async getUserById( id: string ) {
        this.sharedService.validateId(id);
        try {
            const user = await UserModel.findById(id);
            if (!user) throw CustomError.badRequest(`No user with id ${id} has been found`);
            return UserEntity.fromObj(user);
        } catch (error) {
            throw CustomError.internalServer(`${error}`);                        
        }
    };

    public async createUser( createUserDto: CreateUserDto ) {
        return this.authService.registerUser(createUserDto);
    };

    public async updateUser( updateUserDto: UpdateUserDto) {        
        this.sharedService.validateId(updateUserDto.id);
        try {
            const user = await UserModel.findByIdAndUpdate({ _id: updateUserDto.id }, updateUserDto, { new: true });
            if (!user) throw CustomError.badRequest(`No user with id ${updateUserDto.id} has been found`);
            return UserEntity.fromObj(user);
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    };

    public async deleteUser( id: string ) {
        this.sharedService.validateId(id);
        try {
            const user = await UserModel.findByIdAndDelete(id);
            if (!user) throw CustomError.badRequest(`No user with id ${id} has been found`);
            return {
                message: `User with id ${id} has been deleted`, 
                user: UserEntity.fromObj(user)
            }
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    };

}