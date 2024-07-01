import { ReadingModel, SensorModel } from '../../data';
import { CreateReadingDto, CustomError, PaginationDto, ReadingEntity, UpdateReadingDto } from '../../domain';
import { SharedService } from './shared.service';


export class ReadingService {

    constructor(
        private readonly sharedService: SharedService
    ) {}

    private async validateSensorId( sensorId: string ) {
        this.sharedService.validateId(sensorId, 'Invalid sensor');
        await this.sharedService.validateSensorById( sensorId );    
    }

    public async getReadings( paginationDto: PaginationDto ) {
        const { page, limit } = paginationDto;
        try {
            const [ total , readings ] = await Promise.all([
                ReadingModel.countDocuments(),
                ReadingModel.find()
                    .skip( (page - 1) * limit )
                    .limit( limit )
            ]); 

            const readingsObj = readings.map( reading => ReadingEntity.fromObj(reading) );                         

            const totalPages = Math.ceil( total / limit );
            return {
                pagination: {
                    page: page,
                    limit: limit,
                    totalItems: total,
                    totalPages: totalPages,
                    next: (page < totalPages) ? `/api/readings?page=${page + 1}&limit=${limit}` : null,
                    prev: (page - 1 > 0) ? `/api/readings?page=${page - 1}&limit=${limit}` : null,
                    first: `/api/readings?page=1&limit=${limit}`,
                    last: `/api/readings?page=${totalPages}&limit=${limit}`,
                },
                readings: readingsObj
            }
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);            
        }        
    };
    

    public async createReading( createReadingDto: CreateReadingDto ) {            
        try {
            await this.validateSensorId( createReadingDto.sensor );
            const reading = new ReadingModel( createReadingDto );
            await reading.save();

            return ReadingEntity.fromObj(reading);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);
        }
    };

    public async updateReading( updateReadingDto: UpdateReadingDto ) {
        const { id, ...updateOptions } = updateReadingDto;            
        try {
            this.sharedService.validateId(id);
            if (updateOptions.sensor) await this.validateSensorId( updateOptions.sensor );
            const reading = await ReadingModel.findByIdAndUpdate( id, updateOptions, { new: true });
            if (!reading) throw CustomError.badRequest(`No reading with id ${id} has been found`);

            return ReadingEntity.fromObj(reading);        
        } catch (error) {
            if (error instanceof CustomError) throw error;
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
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);            
        }
    };
    
}