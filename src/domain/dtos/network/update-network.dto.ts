

export class UpdateNetworkDto {

    private constructor(
        public readonly id: string,
        public readonly name?: string,
        public readonly description?: string,
        public readonly stations?: string[],        
    ) {}

    static create( object: {[ key: string ]: any }): [ string?, UpdateNetworkDto? ] {
        const { id,  name,  description,  stations, } = object;

        // Check if id is provided and is a non-empty string
        if (!id) return ['Property id is required']
        if (typeof id !== 'string') return ['id property must be a string'];
        if (id.trim() === '') return ['id property must be a non-empty string'];

        if (name) {
            if (typeof name !== 'string') return ['name property must be a string'];
            if (name.trim() === '') return ['name property must be a non-empty string'];
        };

        if (description) {
            if (typeof description !== 'string') return ['description property must be a string'];
            if (description.trim() === '') return ['description property must be a non-empty string'];
        };

        if (stations) {
            if (!Array.isArray(stations)) return ['Property stations must be an array'];
            if (!stations.every((item) => typeof item === 'string')) return ['All elements in stations must be strings'];            
            if (stations.length === 0) return ['Property stations must not be empty'];
        }

        return [ undefined, new UpdateNetworkDto( id,  name,  description,  stations, ) ];
    }
}