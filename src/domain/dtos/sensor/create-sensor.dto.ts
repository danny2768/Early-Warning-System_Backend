import { SensorType } from "../../interfaces/types";

const SENSOR_TYPES: SensorType[] = ["level", "flow", "rain"];

export class CreateSensorDto {
    
    private constructor(
        public readonly name: string,
        public readonly sensorType: SensorType,
        public readonly threshold: number,
        public readonly sendingInterval: number,
        public readonly stationId: string,
    ) {}

    public static create(object: { [key: string]: any }): [ string?, CreateSensorDto? ] {
        const { name, sensorType, threshold, sendingInterval, stationId } = object;

        if (!name) return ['Property name is required']
        if (!sensorType) return ['Property sensorType is required']
        if (!SENSOR_TYPES.includes(sensorType)) return ['Property sensorType is invalid']
        
        if (!threshold) return ['Property threshold is required']
        if (typeof threshold !== 'number') return ['Property threshold must be a number']

        if (!sendingInterval) return ['Property sendingInterval is required']
        if (typeof sendingInterval !== 'number') return ['Property sendingInterval must be a number']

        if (!stationId) return ['Property stationId is required']
        if (typeof stationId !== 'string') return ['stationId property must be a string'];
        if (stationId.trim() === '') return ['stationId property must be a non-empty string'];

        
        return [undefined, new CreateSensorDto( name, sensorType, threshold, sendingInterval, stationId )];
    }
}