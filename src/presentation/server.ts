import express, { Router } from 'express'
import compression from 'compression'

import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from '../swagger';

interface Options {
    port: number,
    routes: Router    
}

export class Server {
    private app = express();

    private readonly port: number;
    private readonly routes: Router;
    
    
    constructor( options: Options) {
        const { port, routes } = options;
        this.port = port;
        this.routes = routes;
        
    }

    start() {
        
        //* Middlewares
        this.app.use( express.json() ); // raw
        this.app.use( express.urlencoded({ extended: true })); // x-www-form-urlencoded        
        this.app.use( compression() );

        // Swagger
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))
        
        //* Routes
        this.app.use(this.routes);
                                
        
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}