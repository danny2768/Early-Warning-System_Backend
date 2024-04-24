import { StationModel } from "../../data";
import { CreateStationDto, CustomError, StationEntity } from "../../domain";
import { SharedService } from "./shared.service";


export class StationService {

    constructor(
        private readonly sharedService: SharedService,
    ) {}

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

        try {
            // If networkId is provided, validate it
            if ( createStationDto.networkId ) {
                this.sharedService.validateId(createStationDto.networkId, 'Invalid networkId');
                await this.sharedService.validateNetworkById(createStationDto.networkId);
            }

            const station = new StationModel(createStationDto);
            await station.save();
            return StationEntity.fromObj(station);
        } catch (error) {
            throw CustomError.internalServer(`${error}`);            
        }
    };

    public async updateStation() {
        // TODO: Implement updateStation
        throw new Error('Method not implemented');
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