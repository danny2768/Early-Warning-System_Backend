import countriesJson from "../data/file-system/countries.json"

export class CountryAdapter {    
    public static validateCountryCode(countryCode: string): boolean {
        const countries = countriesJson;
        return countries.some((country) => country.iso3 === countryCode);
    }

    public static getCountryName(countryCode: string): string | undefined {
        const countries = countriesJson;
        return countries.find((country) => country.iso3 === countryCode)?.name;
    }
}
