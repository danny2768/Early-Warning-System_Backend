import { ReadingModel, SensorModel, StationModel } from "../../data";
import { CreateSensorDto, CustomError, PaginationDto, ReadingEntity, SensorEntity } from "../../domain";
import { SharedService } from "./shared.service";
import { UpdateSensorDto } from '../../domain/dtos/sensor/update-sensor.dto';


export class SensorService {

    constructor(
        private readonly sharedService: SharedService,
    ) {}

    private async validateStationId( stationId: string ) {
        this.sharedService.validateId(stationId, 'Invalid stationId');
        await this.sharedService.validateStationById(stationId);
    }

    public async getSensors( paginationDto: PaginationDto ) {
        const { page, limit } = paginationDto;
        try {
            const [ total , sensors ] = await Promise.all([
                SensorModel.countDocuments(),
                SensorModel.find()
                    .skip( (page - 1) * limit )
                    .limit( limit )
            ]);          
            
            const sensorsObj = sensors.map(sensor => SensorEntity.fromObj(sensor));

            const totalPages = Math.ceil( total / limit );
            return {
                pagination: {
                    page: page,
                    limit: limit,
                    totalItems: total,
                    totalPages: totalPages,
                    next: (page < totalPages) ? `/api/sensors?page=${page + 1}&limit=${limit}` : null,
                    prev: (page - 1 > 0) ? `/api/sensors?page=${page - 1}&limit=${limit}` : null,
                    first: `/api/sensors?page=1&limit=${limit}`,
                    last: `/api/sensors?page=${totalPages}&limit=${limit}`,
                },
                sensors: sensorsObj
            }

        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);            
        }        
    };

    public async getSensorById( id: string ) {
        try {
            this.sharedService.validateId(id);
            const sensor = await SensorModel.findById(id);
            if (!sensor) throw CustomError.badRequest(`No sensor with id ${id} has been found`);

            return SensorEntity.fromObj(sensor);   
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);
        }                
    };

    public async getSensorsByStationId( stationId: string ) {
        try {
            await this.validateStationId(stationId);
            const sensors = await SensorModel.find({ stationId });
            return sensors.map(sensor => SensorEntity.fromObj(sensor));            
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);
        }        
    };

    public async getSensorReadings( id: string, paginationDto: PaginationDto ) {        
        const { page, limit } = paginationDto;
        
        try {
            const sensor = await this.getSensorById(id);            
            const [ total, readings ] = await Promise.all([
                ReadingModel.countDocuments({ sensor: id }),
                ReadingModel.find({ sensor: id })
                    .skip((page - 1) * limit)
                    .limit(limit)
            ]);

            const readingsObj = readings.map(reading => ReadingEntity.fromObj(reading));
            
            const totalPages = Math.ceil(total / limit);
            return  {
                sensor: sensor,
                pagination: {
                    page: page,
                    limit: limit,
                    totalItems: total,
                    totalPages: totalPages,
                    next: (page < totalPages) ? `/api/sensors/${id}/readings?page=${page + 1}&limit=${limit}` : null,
                    prev: (page - 1 > 0) ? `/api/sensors/${id}/readings?page=${page - 1}&limit=${limit}` : null,
                    first: `/api/sensors/${id}/readings?page=1&limit=${limit}`,
                    last: `/api/sensors/${id}/readings?page=${totalPages}&limit=${limit}`,
                },
                readings: readingsObj
            }
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);            
        }        
    }

    public async createSensor( createSensorDto: CreateSensorDto ) {        
        try {            
            const existsSensor = await SensorModel.findOne({ name: createSensorDto.name });
            if (existsSensor) throw CustomError.badRequest('Sensor already exists');
                    
            await this.validateStationId(createSensorDto.stationId);

            const sensor = new SensorModel(createSensorDto);
            await sensor.save();
            
            return SensorEntity.fromObj(sensor);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);
        }
    };

    public async updateSensor( updateSensorDto: UpdateSensorDto ) {
        const { id, ...updateOptions } = updateSensorDto;
        try {
            this.sharedService.validateId(id);    
            if ( updateOptions.stationId ) await this.validateStationId(updateOptions.stationId);

            const sensor = await SensorModel.findByIdAndUpdate(id, updateOptions, { new: true });
            if (!sensor) throw CustomError.badRequest(`No sensor with id ${id} has been found`);
            return SensorEntity.fromObj(sensor);
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    };

    public async deleteSensor( id: string ) {
        this.sharedService.validateId(id);
        try {
            // Delete readings associated with the sensor
            await this.sharedService.deleteReadingsBySensorId(id);
            
            // Delete the sensor
            const sensor = await SensorModel.findByIdAndDelete(id);
            if (!sensor) throw CustomError.badRequest(`No sensor with id ${id} has been found`);
            return {
                message: `Sensor with id ${id} deleted`,
                sensor: SensorEntity.fromObj(sensor)
            }
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);            
        }        
    };

}