import * as lookup from 'country-code-lookup'


export class CountryCodeAdapter {

    public static validateCountryCode(countryCode: string): boolean {
        if ( !!lookup.byIso(countryCode) ) return true;                            
        return false;
    }

    public static getCountryName(countryCode: string): string | undefined {
        return lookup.byIso(countryCode)?.country;        
    }    
}

