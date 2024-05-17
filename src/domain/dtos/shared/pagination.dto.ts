
export class PaginationDto {

    private constructor(
        public readonly page: number,
        public readonly limit: number,        
    ) {}
    
    static create(page: number = 1, limit: number = 10): [ string?, PaginationDto?] {
        
        if ( isNaN(page) || isNaN(limit)  ) return ['Properties page, limit and total must be numbers'];
        if ( page <= 0 || limit <= 0 ) return ['Properties page, limit and total must be greater than 0'];            
        
        return [undefined, new PaginationDto(page, limit )]
    }
}