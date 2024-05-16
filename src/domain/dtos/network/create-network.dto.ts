export class CreateNetworkDto {

    private constructor(
        public readonly name: string,
        public readonly description: string,
    ) {}

    public static create(object: { [key: string]: any }): [ string?, CreateNetworkDto? ] {
        const { name, description } = object;

        if (!name) return ['Property name is required']
        if (!description) return ['Property description is required']

        return [undefined, new CreateNetworkDto( name, description )];
    }
}