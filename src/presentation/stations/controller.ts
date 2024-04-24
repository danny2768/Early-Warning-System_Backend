import { Request, Response } from "express";
import { CreateStationDto, CustomError, UpdateStationDto } from '../../domain';
import { StationService } from '../services/station.service';


export class StationsController {

    constructor(
        public readonly stationService: StationService
    ) {}

    private handleError = ( error: unknown, res: Response ) => {
        if (error instanceof CustomError) {
            return res.status( error.statusCode ).json({ error: error.message })
        }
        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal server error' })
    };

    public getStations = ( req: Request, res: Response ) => {
        this.stationService.getStations()
            .then( stations => res.json(stations) )
            .catch( error => this.handleError(error, res) );
    };

    public getStationById = ( req: Request, res: Response ) => {
        this.stationService.getStationById(req.params.id)
            .then( station => res.json(station) )
            .catch( error => this.handleError(error, res) );
    };

    public createStation = ( req: Request, res: Response ) => {
        const [error, createStationDto] = CreateStationDto.create(req.body);
        if (error) return res.status(400).json({error});            
        
        this.stationService.createStation( createStationDto! )
            .then( station => res.json(station) )
            .catch( error => this.handleError(error, res) );
    };

    public updateStation = ( req: Request, res: Response ) => {
        const id = req.params.id;
        const [error, updateStationDto] = UpdateStationDto.create({ ...req.body, id});
        if (error) return res.status(400).json({error});

        this.stationService.updateStation( updateStationDto! )
            .then( station => res.json(station) )
            .catch( error => this.handleError(error, res) );
    };

    public deleteStation = ( req: Request, res: Response ) => {
        this.stationService.deleteStation(req.params.id)
            .then( station => res.json(station) )
            .catch( error => this.handleError(error, res) );        
    };

}