
export enum SensorType {
    Level = "level", 
    Flow = "flow", 
    Rain = "rain",
}


export class CreateSensorDto {
    
    private constructor(
        public readonly name: string,
        public readonly sensor: SensorType,
        public readonly threshold: string,
        public readonly sendingInterval: string,
        public readonly stationId: string,  
    ) {}

    public static create(object: { [key: string]: any }): [ string?, CreateSensorDto? ] {
        const { name, sensor, threshold, sendingInterval, stationId } = object;

        if (!name) return ['Property name is required']
        if (!sensor) return ['Property sensor is required']
        if (!Object.values(SensorType).includes(sensor)) return ['Property sensor is invalid']
        if (!threshold) return ['Property threshold is required']
        if (!sendingInterval) return ['Property sendingInterval is required']
        if (!stationId) return ['Property stationId is required']

        
        return [undefined, new CreateSensorDto( name, sensor, threshold, sendingInterval, stationId )];
    }
}