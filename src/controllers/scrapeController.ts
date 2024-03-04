import { Request, Response } from 'express';
import { getData, getProcessedData } from '../services/scraperService';
import { Queue } from '../queue/queueService';

const mainQueue = Queue.getInstance();

export const scrapeController = async (req: Request, res: Response) => {
    try {
        const { caseNumber } = req.body;
        if (!validateCaseNumberFormat(caseNumber)) {
            return res.status(400).json({ error: 'Invalid case number format', info: "The format should be similar to this pattern: XXXXXXX-XX.XXXX.X.XX.XXXX where all the XXXXX are integer numerical values." });
        }

        const useQueue = process.env.USE_QUEUE === 'true';
        const result = useQueue ? await mainQueue.enqueue(caseNumber) : await getData(caseNumber);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getDataController = async (req: Request, res: Response) => {
    try {
        const { caseNumber } = req.params;
        if (!validateCaseNumberFormat(caseNumber)) {
            return res.status(400).json({ error: 'Invalid case number format', info: "The format should be similar to this pattern: XXXXXXX-XX.XXXX.X.XX.XXXX where all the XXXXX are integer numerical values." });
        }

        const result = await getProcessedData(caseNumber);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const validateCaseNumberFormat = (caseNumber: string): boolean => {
    const regex = /^\d{7}-\d{2}\.\d{4}\.\d{1,2}\.\d{2}\.\d{4}$/;
    return regex.test(caseNumber);
};
