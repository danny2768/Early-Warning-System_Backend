import { Threshold } from "../../interfaces/threshold.interface";
import { SensorType } from "../../interfaces/types";

const SENSOR_TYPES: SensorType[] = ["level", "flow", "rain"];

export class CreateSensorDto {
    
    private constructor(
        public readonly name: string,
        public readonly sensorType: SensorType,
        public readonly sendingInterval: number,
        public readonly stationId: string,
        public readonly threshold: Threshold,
    ) {}

    public static create(object: { [key: string]: any }): [ string?, CreateSensorDto? ] {
        const { name, sensorType, sendingInterval, stationId, threshold } = object;

        if (!name) return ['Property name is required']
        if (!sensorType) return ['Property sensorType is required']
        if (!SENSOR_TYPES.includes(sensorType)) return ['Property sensorType is invalid']
        
        if (!threshold) return ['Property threshold is required']
        if (typeof threshold !== 'object') return ['Property threshold must be an object']
        if (Object.keys(threshold).length === 0) return ['Property threshold must not be empty']
        
        const { yellow, orange, red, ...extraThreshold } = threshold;
        if (!yellow) return ['Property threshold.yellow is required']
        if (!orange) return ['Property threshold.orange is required']
        if (!red) return ['Property threshold.red is required']
        if (Object.keys(extraThreshold).length > 0) return [`Property threshold has unexpected fields: ${Object.keys(extraThreshold).join(', ')}`]

        if (typeof yellow !== 'number') return ['Property threshold.yellow must be a number']
        if (typeof orange !== 'number') return ['Property threshold.orange must be a number']
        if (typeof red !== 'number') return ['Property threshold.red must be a number']

        if (!sendingInterval) return ['Property sendingInterval is required']
        if (typeof sendingInterval !== 'number') return ['Property sendingInterval must be a number']

        if (!stationId) return ['Property stationId is required']
        if (typeof stationId !== 'string') return ['stationId property must be a string'];
        if (stationId.trim() === '') return ['stationId property must be a non-empty string'];

        
        return [undefined, new CreateSensorDto( name, sensorType, sendingInterval, stationId, threshold )];
    }
}