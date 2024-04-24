export class CreateNetworkDto {

    private constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly stations?: string[],

    ) {}

    public static create(object: { [key: string]: any }): [ string?, CreateNetworkDto? ] {
        const { name, description, stations } = object;

        if (!name) return ['Property name is required']
        if (!description) return ['Property description is required']

        if (stations) {
            if (!Array.isArray(stations)) return ['Property stations must be an array'];
            if (!stations.every((item) => typeof item === 'string')) return ['All elements in stations must be strings'];            
            if (stations.length === 0) return ['Property stations must not be empty'];
        }

        return [undefined, new CreateNetworkDto( name, description, stations)];
    }
}