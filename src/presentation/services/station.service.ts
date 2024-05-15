import { NetworkModel, StationModel } from "../../data";
import { CreateStationDto, CustomError, StationEntity, UpdateStationDto } from "../../domain";
import { SharedService } from "./shared.service";


export class StationService {

    constructor(
        private readonly sharedService: SharedService,
    ) {}

    private async validateSensors( sensors: string[] ) {        
        sensors.forEach(sensorId => {
            this.sharedService.validateId( sensorId, `sensors contains an invalid id: ${sensorId}` );                    
        });

        await Promise.all(
            sensors.map( sensorId => this.sharedService.validateSensorById(sensorId) )
        );        
    }

    private async validateNetworkId( networkId: string ) {
        this.sharedService.validateId(networkId, 'Invalid networkId'); // Regex validation
        await this.sharedService.validateNetworkById(networkId); // DB validation existance
    }

    public async getStations() {
        const stations = await StationModel.find();
        if (!stations) throw CustomError.badRequest('No station has been found');

        return stations.map(station => StationEntity.fromObj(station));
    };

    public async getStationById( id: string ) {
        this.sharedService.validateId(id);
        const station = await StationModel.findById(id);
        if (!station) throw CustomError.badRequest(`No station with id ${id} has been found`);
    
        return StationEntity.fromObj(station);
    };

    public async createStation( createStationDto: CreateStationDto ) {
        const existsStation = await StationModel.findOne({ name: createStationDto.name });
        if (existsStation) throw CustomError.badRequest('Station already exists');
        
        if ( createStationDto.networkId ) await this.validateNetworkId(createStationDto.networkId);

        try {
            const station = new StationModel(createStationDto);
            await station.save();

            if ( createStationDto.networkId ) {
                const network = await NetworkModel.findById( createStationDto.networkId );
                if ( network && !network.stations.includes(station._id) ) {
                    network.stations.push(station._id);
                    await network.save();
                }
            }

            return StationEntity.fromObj(station);
        } catch (error) {
            throw CustomError.internalServer(`${error}`);            
        }
    };

    public async updateStation( updateStationDto: UpdateStationDto ) {
        const { id, ...updateOptions } = updateStationDto;
        this.sharedService.validateId(id);

        if ( updateOptions.networkId ) await this.validateNetworkId(updateOptions.networkId);

        try {
            const station = await StationModel.findByIdAndUpdate({ _id: id }, updateOptions, { new: true });
            if (!station) throw CustomError.badRequest(`No station with id ${id} has been found`);

            if ( updateStationDto.networkId ) {
                const network = await NetworkModel.findById( updateStationDto.networkId );
                if ( network && !network.stations.includes(station._id) ) {
                    network.stations.push(station._id);
                    await network.save();
                }
            }

            return StationEntity.fromObj(station);
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }

    };

    public async deleteStation( id: string ) {
        this.sharedService.validateId(id);
        try {
            const station = await StationModel.findByIdAndDelete(id);
            if (!station) throw CustomError.badRequest(`No station with id ${id} has been found`);
            return {
                message: `Station with id ${id} deleted`,
                station: StationEntity.fromObj(station)
            }
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    };

}