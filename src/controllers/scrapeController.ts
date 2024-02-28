import { Request, Response } from 'express';
import { scrapeData } from '../services/scraperService';

export const scrapeController = async (req: Request, res: Response) => {
    try {
        const scrapedData = await scrapeData(req.body.caseNumber);
        res.status(200).json(scrapedData);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};