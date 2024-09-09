import { Request, Response } from "express";
import { CustomError } from "../../domain";
import countriesJson from "../../data/file-system/countries.json";

export class CountriesController {
    constructor() {}

    public getCountries = (req: Request, res: Response) => {
        try {
            res.json(countriesJson);
        } catch (error) {
            res.status(500).json({ error: "An error occurred while fetching countries" });
        }
    };

    public getCountryById = (req: Request, res: Response) => {
        try {
            const country = countriesJson.find((country) => country.id === +req.params.id);
            if (!country) {
                return res.status(404).json({ error: "Country not found" });
            }
            res.json(country);
        } catch (error) {
            res.status(500).json({ error: "An error occurred while fetching the country" });
        }
    };

    public getCountryByIso3 = (req: Request, res: Response) => {
        try {
            const country = countriesJson.find((country) => country.iso3 === req.params.iso3);
            if (!country) {
                return res.status(404).json({ error: "Country not found" });
            }
            res.json(country);
        } catch (error) {
            res.status(500).json({ error: "An error occurred while fetching the country" });
        }
    };
}