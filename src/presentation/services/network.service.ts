import { NetworkModel } from "../../data";
import { CustomError, NetworkEntity } from "../../domain";
import { SharedService } from "./shared.service";
import { CreateNetworkDto } from '../../domain/dtos/network/create-network.dto';
import { UpdateNetworkDto } from '../../domain/dtos/network/update-network.dto';

export class NetworkService {
    
    constructor(
        private readonly sharedService: SharedService,
    ) {}

    private async validateStations( stations: string[] ) {        
        stations.forEach(stationId => {
            this.sharedService.validateId( stationId, `stations contains an invalid id: ${stationId}` );                    
        });

        await Promise.all(
            stations.map( stationId => this.sharedService.validateStationById(stationId) )
        );        
    }

    public async getNetworks() {
        const networks = await NetworkModel.find();
        if (!networks) throw CustomError.badRequest('No networks has been found');        
            
        return networks.map(network => NetworkEntity.fromObj(network));
    };

    public async getNetworkById( id: string ) {
        this.sharedService.validateId(id);
        const network = await NetworkModel.findById(id);
        if (!network) throw CustomError.badRequest(`No network with id ${id} has been found`);

        return NetworkEntity.fromObj(network);
    };

    public async createNetwork( createNetworkDto: CreateNetworkDto ) {
        const existsNetwork = await NetworkModel.findOne({ name: createNetworkDto.name });
        if (existsNetwork) throw CustomError.badRequest('Network already exists');

        if (createNetworkDto.stations) await this.validateStations(createNetworkDto.stations);        
 
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
        
        if (updateOptions.stations) await this.validateStations(updateOptions.stations);
        
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