
export enum SensorType {
    Level = "level", 
    Flow = "flow", 
    Rain = "rain",
}


export class CreateSensorDto {
    
    private constructor(
        public readonly name: string,
        public readonly sensor: SensorType,
        public readonly threshold: number,
        public readonly sendingInterval: number,
        public readonly stationId: string,
    ) {}

    public static create(object: { [key: string]: any }): [ string?, CreateSensorDto? ] {
        const { name, sensor, threshold, sendingInterval, stationId } = object;

        if (!name) return ['Property name is required']
        if (!sensor) return ['Property sensor is required']
        if (!Object.values(SensorType).includes(sensor)) return ['Property sensor is invalid']
        
        if (!threshold) return ['Property threshold is required']
        if (typeof threshold !== 'number') return ['Property threshold must be a number']

        if (!sendingInterval) return ['Property sendingInterval is required']
        if (typeof sendingInterval !== 'number') return ['Property sendingInterval must be a number']

        if (!stationId) return ['Property stationId is required']
        if (typeof stationId !== 'string') return ['stationId property must be a string'];
        if (stationId.trim() === '') return ['stationId property must be a non-empty string'];

        
        return [undefined, new CreateSensorDto( name, sensor, threshold, sendingInterval, stationId )];
    }
}