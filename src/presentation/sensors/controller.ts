import { Request, Response } from "express";

export class SensorsController {

    constructor() {}

    public getSensors = ( req: Request, res: Response ) => {
        
        return res.json('getAll');
    };

    public getSensorById = ( req: Request, res: Response ) => {
        
        return res.json('getSensorById');
    };

    public createSensor = ( req: Request, res: Response ) => {
        
        return res.json('createSensor');
    };

    public updateSensor = ( req: Request, res: Response ) => {
        
        return res.json('updateSensor');
    };

    public deleteSensor = ( req: Request, res: Response ) => {
        
        return res.json('deleteSensor');
    };

}