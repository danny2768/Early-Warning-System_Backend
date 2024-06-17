import { NetworkModel } from "../../data";
import { CustomError, NetworkEntity, PaginationDto } from "../../domain";
import { SharedService } from "./shared.service";
import { CreateNetworkDto } from '../../domain/dtos/network/create-network.dto';
import { UpdateNetworkDto } from '../../domain/dtos/network/update-network.dto';

export class NetworkService {
    
    constructor(
        private readonly sharedService: SharedService,
    ) {}

    public async getNetworks( paginationDto: PaginationDto ) {
        const { page, limit } = paginationDto;
        try {
            const [ total, networks ] = await Promise.all([
                NetworkModel.countDocuments(),
                NetworkModel.find()
                    .skip( (page - 1) * limit )
                    .limit( limit )
            ]);

            const networksObj = networks.map( network => NetworkEntity.fromObj(network) );
            
            const totalPages = Math.ceil( total / limit );
            return {
                pagination: {
                    page: page,
                    limit: limit,
                    totalItems: total,
                    totalPages: totalPages,
                    next: (page < totalPages) ? `/api/networks?page=${page + 1}&limit=${limit}` : null,
                    prev: (page - 1 > 0) ? `/api/networks?page=${page - 1}&limit=${limit}` : null,
                    first: `/api/networks?page=1&limit=${limit}`,
                    last: `/api/networks?page=${totalPages}&limit=${limit}`,
                },
                networks: networksObj
            }
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    };

    public async getNetworkById( id: string ) {
        try {
            this.sharedService.validateId(id);
            const network = await NetworkModel.findById(id);
            if (!network) {
                throw CustomError.badRequest(`No network with id ${id} has been found`);
            }

            return NetworkEntity.fromObj(network);
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    };

    public async createNetwork( createNetworkDto: CreateNetworkDto ) {
        const existsNetwork = await NetworkModel.findOne({ name: createNetworkDto.name });
        if (existsNetwork) throw CustomError.badRequest('Network already exists');

        try {            
            const network = new NetworkModel(createNetworkDto);
            await network.save();

            return NetworkEntity.fromObj(network);
        } catch (error) {
            throw CustomError.internalServer(`${error}`);            
        }
    };

    public async updateNetwork( updateNetworkDto: UpdateNetworkDto) {
        const { id, ...updateOptions } = updateNetworkDto;

        this.sharedService.validateId(id);
        
        
        try {
            const network = await NetworkModel.findByIdAndUpdate({ _id: id }, updateOptions, { new: true });
            if (!network) throw CustomError.badRequest(`No network with id ${id} has been found`);

            return NetworkEntity.fromObj(network);            
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
        
    };

    public async deleteNetwork( id: string ) {
        this.sharedService.validateId(id);
        try {
            const network = await NetworkModel.findByIdAndDelete(id);
            if (!network) throw CustomError.badRequest(`No network with id ${id} has been found`);
            return {
                message: `Network with id ${id} deleted`,
                network: NetworkEntity.fromObj(network)
            }
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    };

}