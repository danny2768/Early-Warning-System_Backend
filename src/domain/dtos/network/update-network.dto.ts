

export class UpdateNetworkDto {

    private constructor(
        public readonly id: string,
        public readonly name?: string,
        public readonly description?: string,
    ) {}

    static create( object: {[ key: string ]: any }): [ string?, UpdateNetworkDto? ] {
        const { id,  name,  description } = object;

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

        return [ undefined, new UpdateNetworkDto( id,  name,  description ) ];
    }
}