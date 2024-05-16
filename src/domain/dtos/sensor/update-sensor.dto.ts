import { SensorType, Threshold } from "../..";

const SENSOR_TYPES: SensorType[] = ["level", "flow", "rain"];

export class UpdateSensorDto {
    
    private constructor(
        public readonly id: string,
        public readonly name?: string,        
        public readonly sensorType?: SensorType,
        public readonly threshold?: Threshold,
        public readonly sendingInterval?: number,
        public readonly stationId?: string,
    ) {}

    public static create(object: { [key: string]: any }): [ string?, UpdateSensorDto? ] {
        
        const { id, name, sensorType, threshold, sendingInterval, stationId } = object;

        if (!id) return ['Property id is required'];
        if (typeof id !== 'string') return ['id property must be a string'];
        if (id.trim() === '') return ['id property must be a non-empty string'];
        
        if (name) {
            if (typeof name !== 'string') return ['name property must be a string'];
            if (name.trim() === '') return ['name property must be a non-empty string'];
        };
        
        if (sensorType) {    
            if (!SENSOR_TYPES.includes(sensorType)) return ['Property sensorType is invalid']
        }

        if (threshold) {
            const { yellow, orange, red, ...extraThreshold } = threshold;
            if (Object.keys(extraThreshold).length > 0) return [`Property threshold has unexpected fields: ${Object.keys(extraThreshold).join(', ')}`]

            if (yellow) {
                if (typeof yellow !== 'number') return ['Property threshold.yellow must be a number']
            }
            if (orange) {
                if (typeof orange !== 'number') return ['Property threshold.orange must be a number']
            }
            if (red) {
                if (typeof red !== 'number') return ['Property threshold.red must be a number']
            }            
        }
        
        if (sendingInterval) {
            if (typeof sendingInterval !== 'number') return ['sendingInterval property must be a number'];
        }
    
        if (stationId) {
            if (typeof stationId !== 'string') return ['stationId property must be a string'];
            if (stationId.trim() === '') return ['stationId property must be a non-empty string'];
        }

        return [undefined, new UpdateSensorDto( id, name, sensorType, threshold, sendingInterval, stationId )];
    }
}