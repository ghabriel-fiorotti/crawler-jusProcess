import { Request, Response } from 'express';
import { getData, getProcessedData } from '../services/scraperService';
import { Queue } from '../queue/queueService'

const mainQueue = Queue.getInstance();

export const scrapeController = async (req: Request, res: Response) => {
    try {
        const useQueue = process.env.USE_QUEUE === 'true';
        const result = useQueue ? await mainQueue.enqueue(req.body.caseNumber) : await getData(req.body.caseNumber);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const getDataController = async (req: Request, res: Response) => {
    try {
        const result = await getProcessedData(req.params.caseNumber)
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};