import { Request, Response } from "express";
import { ReadingService } from "../services";
import { CreateReadingDto, CustomError, PaginationDto, UpdateReadingDto } from "../../domain";

export class ReadingsController {
    
    constructor(
        public readonly readingService: ReadingService
    ) {}

    private handleError = ( error: unknown, res: Response ) => {
        if (error instanceof CustomError) {
            return res.status( error.statusCode ).json({ error: error.message })
        }
        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal server error' })
    };

    public getReadings = ( req: Request, res: Response ) => {
        const { page = 1, limit = 10 } = req.query;
        const [ error, paginationDto ] = PaginationDto.create( +page, +limit );
        if (error) return res.status(400).json({error});
        
        this.readingService.getReadings( paginationDto! )
            .then( readings => res.json(readings) )
            .catch( error => this.handleError(error, res)) ;
    };

    public createReading = ( req: Request, res: Response ) => {
        const [error, createReadingDto] = CreateReadingDto.create(req.body);
        if (error) return res.status(400).json({error});            

        this.readingService.createReading( createReadingDto! )
            .then( reading => res.status(201).json(reading) )
            .catch( error => this.handleError(error, res) );
    };

    public updateReading = (req: Request, res: Response) => {
        const id = req.params.id;
        const [error, updateReadingDto] = UpdateReadingDto.create({ ...req.body, id});
        if (error) return res.status(400).json({error});

        this.readingService.updateReading( updateReadingDto! )
            .then( reading => res.json(reading) )
            .catch( error => this.handleError(error, res) );
    };

    public deleteReading = ( req: Request, res: Response ) => {
        this.readingService.deleteReading(req.params.id)
            .then( reading => res.json(reading) )
            .catch( error => this.handleError(error, res) );
    };


}