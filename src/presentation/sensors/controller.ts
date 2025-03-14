import { Request, Response } from "express";
import { CreateSensorDto, CustomError, PaginationDto, UpdateSensorDto } from "../../domain";
import { SensorService } from "../services";

export class SensorsController {

    constructor(
        public readonly sensorService: SensorService
    ) {}

    private handleError = ( error: unknown, res: Response ) => {
        if (error instanceof CustomError) {
            return res.status( error.statusCode ).json({ error: error.message })
        }
        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal server error' })
    };

    public getSensors = ( req: Request, res: Response ) => {
        const { page = 1, limit = 10 } = req.query;
        const [ error, paginationDto ] = PaginationDto.create( +page, +limit );
        if (error) return res.status(400).json({error});
        
        this.sensorService.getSensors( paginationDto! )
            .then( sensors => res.json(sensors) )
            .catch( error => this.handleError(error, res) );        
    };

    public getSensorById = ( req: Request, res: Response ) => {
        const id = req.params.id;
        this.sensorService.getSensorById(id)
            .then( sensor => res.json(sensor) )
            .catch( error => this.handleError(error, res) );
    };

    public getSensorByStationId = ( req: Request, res: Response ) => {        
        this.sensorService.getSensorsByStationId(req.params.id)
            .then( sensor => res.json(sensor) )
            .catch( error => this.handleError(error, res) );
    };

    public getSensorReadings = ( req: Request, res: Response ) => {        
        const { page = 1, limit = 10 } = req.query;
        const [ error, paginationDto ] = PaginationDto.create( +page, +limit );
        if (error) return res.status(400).json({error});
        
        const id = req.params.id;
        this.sensorService.getSensorReadings( id, paginationDto!)
            .then( readings => res.json(readings) )
            .catch( error => this.handleError(error, res) );        
    };

    public createSensor = ( req: Request, res: Response ) => {
        const [error, createSensorDto] = CreateSensorDto.create(req.body);
        if (error) return res.status(400).json({error});            

        this.sensorService.createSensor( createSensorDto! )
            .then( sensor => res.status(201).json(sensor) )
            .catch( error => this.handleError(error, res) );        
    };

    public updateSensor = ( req: Request, res: Response ) => {
        const id = req.params.id;
        const [error, updateSensorDto] = UpdateSensorDto.create({ ...req.body, id});
        if (error) return res.status(400).json({error});

        this.sensorService.updateSensor( updateSensorDto! )
            .then( sensor => res.json(sensor) )
            .catch( error => this.handleError(error, res) );
    };

    public deleteSensor = ( req: Request, res: Response ) => {
        const id = req.params.id;
        this.sensorService.deleteSensor(id)
            .then( sensor => res.json(sensor) )
            .catch( error => this.handleError(error, res) );        
    };

}