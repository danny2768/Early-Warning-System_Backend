import { Request, Response } from "express";
import { CreateSensorDto, CustomError } from "../../domain";
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
        this.sensorService.getSensors()
            .then( sensors => res.json(sensors) )
            .catch( error => this.handleError(error, res) );        
    };

    public getSensorById = ( req: Request, res: Response ) => {
        const id = req.params.id;
        this.sensorService.getSensorById(id)
            .then( sensor => res.json(sensor) )
            .catch( error => this.handleError(error, res) );
    };

    public getSensorByIdWithReadings = ( req: Request, res: Response ) => {
        const id = req.params.id;
        this.sensorService.getSensorByIdWithReadings(id)
            .then( sensor => res.json(sensor) )
            .catch( error => this.handleError(error, res) );
    };

    public createSensor = ( req: Request, res: Response ) => {
        const [error, createSensorDto] = CreateSensorDto.create(req.body);
        if (error) return res.status(400).json({error});            

        this.sensorService.createSensor( createSensorDto! )
            .then( sensor => res.json(sensor) )
            .catch( error => this.handleError(error, res) );        
    };

    public updateSensor = ( req: Request, res: Response ) => {
        // TODO: implement updateSensor
        return res.json('updateSensor');
    };

    public deleteSensor = ( req: Request, res: Response ) => {
        const id = req.params.id;
        this.sensorService.deleteSensor(id)
            .then( sensor => res.json(sensor) )
            .catch( error => this.handleError(error, res) );        
    };

}