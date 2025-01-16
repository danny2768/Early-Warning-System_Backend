export class CreateReadingDto {

    private constructor(
        public readonly value: number,
        public readonly sensor: string,        
    ) {}

    public static create(object: { [key: string]: any }): [ string?, CreateReadingDto? ] {
        const { value, sensor } = object;
        
        if (value === undefined || value === null) return ['Property value is required'];
        if (typeof value !== 'number') return ['Property value must be a number'];

        if (!sensor) return ['Property sensor is required'];                
        if (typeof sensor !== 'string') return ['Property sensor must be a string'];

        return [undefined, new CreateReadingDto( value, sensor )];
    }
}