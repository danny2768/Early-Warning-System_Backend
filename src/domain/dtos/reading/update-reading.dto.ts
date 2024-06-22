

export class UpdateReadingDto {

    private constructor(
        public readonly id: string,
        public readonly value: number,
        public readonly sensor: string,        
    ) {}

    static create( object: {[ key: string ]: any }): [ string?, UpdateReadingDto? ] {
        const { id, value, sensor } = object;

        if (!id) return ['Property id is required']
        if (typeof id !== 'string') return ['id property must be a string'];
        if (id.trim() === '') return ['id property must be a non-empty string'];

        if (value) {
            if (typeof value !== 'number') return ['Property value must be a number'];
            // if (value < 0) return ['Property value must be a positive number'];
        }

        if (sensor) {
            if (typeof sensor !== 'string') return ['Property sensor must be a string'];
            if (sensor.trim() === '') return ['Property sensor must be a non-empty string'];
        }

        return [ undefined, new UpdateReadingDto( id, value, sensor )];
    }
}