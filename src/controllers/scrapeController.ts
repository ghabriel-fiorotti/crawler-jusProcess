import { Request, Response } from 'express';
import { getData } from '../services/scraperService';

export const scrapeController = async (req: Request, res: Response) => {
    try {
        const scrapedData = await getData(req.body.caseNumber);
        res.status(200).json(scrapedData);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};