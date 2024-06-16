import { NetworkModel, StationModel } from "../../data";
import { CreateStationDto, CustomError, PaginationDto, StationEntity, UpdateStationDto } from "../../domain";
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

    public async getStations( paginationDto: PaginationDto ) {
        const { page, limit } = paginationDto;
        try {
            const [ total, stations ] = await Promise.all([
                StationModel.countDocuments(),
                StationModel.find()
                    .skip( (page - 1) * limit )
                    .limit( limit )
            ]);

            const stationsObj = stations.map( station => StationEntity.fromObj(station) );

            const totalPages = Math.ceil( total / limit );

            return {
                pagination: {
                    page: page,
                    limit: limit,
                    totalItems: total,
                    totalPages: totalPages,
                    next: (page < totalPages) ? `/api/stations?page=${page + 1}&limit=${limit}` : null,
                    prev: (page - 1 > 0) ? `/api/stations?page=${page - 1}&limit=${limit}` : null,
                    first: `/api/stations?page=1&limit=${limit}`,
                    last: `/api/stations?page=${totalPages}&limit=${limit}`,
                },
                stations: stationsObj
            }
        } catch (error) {
            throw CustomError.internalServer(`${error}`);                        
        }    
    };

    public async getStationById( id: string ) {
        this.sharedService.validateId(id);
        const station = await StationModel.findById(id);
        if (!station) throw CustomError.badRequest(`No station with id ${id} has been found`);
    
        return StationEntity.fromObj(station);
    };

    public async getStationsByNetworkId( networkId: string, paginationDto: PaginationDto ) {
        const { page, limit } = paginationDto;
        this.validateNetworkId(networkId);
        try {
            const [ total,  stations ] = await Promise.all([
                StationModel.countDocuments({ networkId }),
                StationModel.find({ networkId })
                    .skip( (page - 1) * limit )
                    .limit( limit )
            ]);

            const stationsObj = stations.map( station => StationEntity.fromObj(station) );

            const totalPages = Math.ceil( total / limit );

            return {
                pagination: {
                    page: page,
                    limit: limit,
                    totalItems: total,
                    totalPages: totalPages,
                    next: (page < totalPages) ? `/api/stations/by-network/${networkId}?page=${page + 1}&limit=${limit}` : null,
                    prev: (page - 1 > 0) ? `/api/stations/by-network/${networkId}?page=${page - 1}&limit=${limit}` : null,
                    first: `/api/stations/by-network/${networkId}?page=1&limit=${limit}`,
                    last: `/api/stations/by-network/${networkId}?page=${totalPages}&limit=${limit}`,
                },
                stations: stationsObj
            }
        } catch (error) {
            throw CustomError.internalServer(`${error}`);                        
        }
    }

    public async createStation( createStationDto: CreateStationDto ) {
        const existsStation = await StationModel.findOne({ name: createStationDto.name });
        if (existsStation) throw CustomError.badRequest('Station already exists');
        
        await this.validateNetworkId(createStationDto.networkId);

        try {
            const station = new StationModel(createStationDto);
            await station.save();

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