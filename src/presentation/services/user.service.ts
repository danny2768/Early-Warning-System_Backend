import { AuthService, SharedService } from ".";
import { CreateUserDto, CustomError, PaginationDto, UpdateUserDto, UserEntity } from "../../domain";
import { UserModel } from "../../data";
import { BcryptAdapter } from "../../config";




export class UserService {

    constructor(
        private readonly sharedService: SharedService,
        private readonly authService: AuthService,
    ) {}

    public async getUsers( paginationDto: PaginationDto ) {
        const { page, limit } = paginationDto;
        try {
            const [ total , users ] = await Promise.all([
                UserModel.countDocuments(),
                UserModel.find()
                    .skip( (page - 1) * limit )
                    .limit( limit )
            ]); 

            const usersObj = users.map( user => UserEntity.fromObj(user) );                         

            const totalPages = Math.ceil( total / limit );
            return {
                pagination: {
                    page: page,
                    limit: limit,
                    totalItems: total,
                    totalPages: totalPages,
                    next: (page < totalPages) ? `/api/users?page=${page + 1}&limit=${limit}` : null,
                    prev: (page - 1 > 0) ? `/api/users?page=${page - 1}&limit=${limit}` : null,
                    first: `/api/users?page=1&limit=${limit}`,
                    last: `/api/users?page=${totalPages}&limit=${limit}`,
                },
                users: usersObj
            }
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
            let updateUser = { ...updateUserDto };
            if (updateUserDto.password) {
                updateUser.password = BcryptAdapter.hash(updateUserDto.password);
            }
            const user = await UserModel.findByIdAndUpdate({ _id: updateUser.id }, updateUser, { new: true });
            if (!user) throw CustomError.badRequest(`No user with id ${updateUser.id} has been found`);
            
            const { password, ...userEntity } = UserEntity.fromObj(user);

            return userEntity;
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