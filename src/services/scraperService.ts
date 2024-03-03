import fs from 'fs';
import path from 'path';
import { Worker } from '../workers/worker';
import { FinalResult } from '../workers/resultTypes';

export const extractCourtNumber = (caseNumber: string): string | null => {
    const regex = /\.8\.(\d+)\./;
    const match = regex.exec(caseNumber);
    return match && match[1] ? match[1] : null;
};

const isOnline = (numberCourt: string): boolean | null => {
    const filePath = path.join(__dirname, '../healthCheck/sitesStatus.json');
    if (fs.existsSync(filePath)) {
        const statusData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        return statusData[numberCourt]?.isOnline || null;
    }
    return null;
};

export const getData = async (caseNumber: string) => {
    try {
        const numberCourt = extractCourtNumber(caseNumber);
        if (!numberCourt) {
            throw new Error('Court number not found in the case number.');
        }


        /* In this case, when the website is offline, it will attempt to retrieve a previously made collection.
           In this project, a local directory was used, but it can be replaced by an AWS S3 bucket or 
           any other file storage system.
        */

        if (!isOnline(numberCourt)) {
            const consolidatedFilePath = path.join(__dirname, `../consolidated/${caseNumber}.json`);
            if (!fs.existsSync(consolidatedFilePath)) {
                throw new Error('Previous data file not found. The site is inactive and no previous data is available.');
            }
            const fileContent = fs.readFileSync(consolidatedFilePath, 'utf-8');
            const finalResult: FinalResult = JSON.parse(fileContent)
            return { info: "The website was down, returning information from the last collect", ...finalResult }
        }

        const worker = new Worker(numberCourt, caseNumber);

        const result = await worker.performTask();

        return result;
    } catch (error) {
        return { "message": (error as Error).message, "status_code": 422 };
    }
};

export const getProcessedData = async (caseNumber: string) => {

    try {
        const consolidatedFilePath = path.join(__dirname, `../processedFiles/${caseNumber}.json`);
        if (!fs.existsSync(consolidatedFilePath)) {
            throw new Error('File not yet processed, please try again later.');
        }
        const fileContent = fs.readFileSync(consolidatedFilePath, 'utf-8');
        const finalResult: FinalResult = JSON.parse(fileContent)

        return finalResult;
    } catch (error) {
        return { "message": (error as Error).message, "status_code": 422 };
    }
}