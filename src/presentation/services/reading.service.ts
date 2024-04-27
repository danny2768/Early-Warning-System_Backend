import { ReadingModel, SensorModel } from '../../data';
import { CreateReadingDto, CustomError, ReadingEntity, UpdateReadingDto } from '../../domain';
import { SharedService } from './shared.service';


export class ReadingService {

    constructor(
        private readonly sharedService: SharedService
    ) {}

    private async validateSensorId( sensorId: string ) {
        this.sharedService.validateId(sensorId, 'Invalid sensor');
        await this.sharedService.validateSensorById( sensorId );    
    }

    public async getReadings() {
        const readings = await ReadingModel.find();
        if (!readings) throw CustomError.badRequest('No readings found');

        return readings.map( reading => ReadingEntity.fromObj(reading) );
    };
    

    public async createReading( createReadingDto: CreateReadingDto ) {
        
        await this.validateSensorId( createReadingDto.sensor );

        try {
            const reading = new ReadingModel( createReadingDto );
            await reading.save();

            // Add reading to sensor
            const sensor = await SensorModel.findById( reading.sensor );
            if (sensor && !sensor.readings.includes(reading.id)) {
                sensor.readings.push( reading.id );
                await sensor.save();
            }

            return ReadingEntity.fromObj(reading);
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    };

    public async updateReading( updateReadingDto: UpdateReadingDto ) {
        const { id, ...updateOptions } = updateReadingDto;
        this.sharedService.validateId(id);

        if (updateOptions.sensor) await this.validateSensorId( updateOptions.sensor );

        try {
            const reading = await ReadingModel.findByIdAndUpdate( id, updateOptions, { new: true });
            if (!reading) throw CustomError.badRequest(`No reading with id ${id} has been found`);

            if (updateOptions.sensor) {
                const sensor = await SensorModel.findById(reading.sensor);
                if (sensor && !sensor.readings.includes(reading.id)) {
                    sensor.readings.push( reading.id );
                    await sensor.save();
                }
            }

            return ReadingEntity.fromObj(reading);        
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    };

    public async deleteReading( id: string) {
        this.sharedService.validateId(id);
        try {
            const reading = await ReadingModel.findByIdAndDelete(id);
            if (!reading) throw CustomError.badRequest(`No reading with id ${id} has been found`);
            return {
                message: `Reading with id ${id} deleted`,
                reading: ReadingEntity.fromObj(reading)
            }
        } catch (error) {
            throw CustomError.internalServer(`${error}`);            
        }
    };
    
}