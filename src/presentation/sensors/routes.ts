import { Router } from 'express';
import { SensorsController } from './controller';


export class SensorsRoutes {


  static get routes(): Router {

    const router = Router();
    const controller = new SensorsController();
    
    router.get('/', controller.getSensors );
    router.get('/:id', controller.getSensorById );

    router.post('/', controller.createSensor);

    router.put('/:id', controller.updateSensor);

    router.delete('/:id', controller.deleteSensor);
    return router;
  }


}

