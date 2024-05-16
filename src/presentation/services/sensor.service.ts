import { SensorModel, StationModel } from "../../data";
import { CreateSensorDto, CustomError, SensorEntity } from "../../domain";
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

    public async getSensors() {
        const sensors = await SensorModel.find();
        if (!sensors) throw CustomError.badRequest('No sensor has been found');
            
        return sensors.map(sensor => SensorEntity.fromObj(sensor));
    };

    public async getSensorById( id: string ) {
        this.sharedService.validateId(id);
        const sensor = await SensorModel.findById(id);
        if (!sensor) throw CustomError.badRequest(`No sensor with id ${id} has been found`);

        return SensorEntity.fromObj(sensor);
    };

    public async createSensor( createSensorDto: CreateSensorDto ) {
        const existsSensor = await SensorModel.findOne({ name: createSensorDto.name });
        if (existsSensor) throw CustomError.badRequest('Sensor already exists');
                
        await this.validateStationId(createSensorDto.stationId);

        try {            
            const sensor = new SensorModel(createSensorDto);
            await sensor.save();
            
            return SensorEntity.fromObj(sensor);
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    };

    public async updateSensor( updateSensorDto: UpdateSensorDto ) {
        const { id, ...updateOptions } = updateSensorDto;
        this.sharedService.validateId(id);

        if ( updateOptions.stationId ) await this.validateStationId(updateOptions.stationId);
        try {
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
            const sensor = await SensorModel.findByIdAndDelete(id);
            if (!sensor) throw CustomError.badRequest(`No sensor with id ${id} has been found`);
            return {
                message: `Sensor with id ${id} deleted`,
                sensor: SensorEntity.fromObj(sensor)
            }
        } catch (error) {
            throw CustomError.internalServer(`${error}`);            
        }        
    };

}