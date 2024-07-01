

export class CreateReadingDto {

    private constructor(
        public readonly value: string,
        public readonly sensor: string,        
    ) {}

    public static create(object: { [key: string]: any }): [ string?, CreateReadingDto? ] {
        const { value, sensor } = object;
        
        if (!value) return ['Property value is required'];
        if (!sensor) return ['Property sensor is required'];                

        return [undefined, new CreateReadingDto( value, sensor )];
    }
}