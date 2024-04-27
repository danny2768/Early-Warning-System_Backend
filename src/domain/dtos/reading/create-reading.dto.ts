

export class CreateReadingDto {

    private constructor(
        public readonly value: string,
        public readonly sensor: string,
        public readonly sentAt: Date,
    ) {}

    public static create(object: { [key: string]: any }): [ string?, CreateReadingDto? ] {
        const { value, sensor, sentAt } = object;
        
        if (!value) return ['Property value is required'];
        if (!sensor) return ['Property sensor is required'];
                
        if (!sentAt) {
            return ['Property sentAt is required'];
        } else {
            let newSentAt;
            newSentAt = new Date(sentAt);
            if ( isNaN(newSentAt.getTime()) ) return ['Property sentAt is invalid'];
            object.sentAt = newSentAt;
        }


        return [undefined, new CreateReadingDto( value, sensor, sentAt )];
    }
}