import { SensorModel } from "../../data";
import { CreateSensorDto, CustomError, SensorEntity } from "../../domain";
import { SharedService } from "./shared.service";


export class SensorService {

    constructor(
        private readonly sharedService: SharedService,
    ) {}

    public async getSensors() {
        const sensors = await SensorModel.find().select('-readings');
        if (!sensors) throw CustomError.badRequest('No sensor has been found');
            
        return sensors.map(sensor => SensorEntity.fromObj(sensor));
    };

    public async getSensorById( id: string ) {
        this.sharedService.validateId(id);
        const sensor = await SensorModel.findById(id).select('-readings');
        if (!sensor) throw CustomError.badRequest(`No sensor with id ${id} has been found`);

        return SensorEntity.fromObj(sensor);
    };

    public async getSensorByIdWithReadings( id: string ) {
        this.sharedService.validateId(id);
        const sensor = await SensorModel.findById(id);
        if (!sensor) throw CustomError.badRequest(`No sensor with id ${id} has been found`);

        return SensorEntity.fromObj(sensor);
    };

    public async createSensor( createSensorDto: CreateSensorDto ) {
        const existsSensor = await SensorModel.findOne({ name: createSensorDto.name });
        if (existsSensor) throw CustomError.badRequest('Sensor already exists');
        
        this.sharedService.validateId(createSensorDto.stationId, 'Invalid stationId');

        try {
            // TODO: Validate if stationId exists
            // First we make sure the stationId exists
            // const station = await StationModel.fin

            const sensor = new SensorModel(createSensorDto);
            await sensor.save();
            return SensorEntity.fromObj(sensor);
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    };

    public async updateSensor() {
        // TODO: Implement updateSensor
        throw new Error('Method not implemented');
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