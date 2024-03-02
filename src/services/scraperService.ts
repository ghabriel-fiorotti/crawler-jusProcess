import fs from 'fs';
import path from 'path';
import { Worker } from '../workers/worker';

const extractCourtNumber = (caseNumber: string): string | null => {
    const regex = /\.8\.(\d+)\./;
    const match = regex.exec(caseNumber);
    return match && match[1] ? match[1] : null;
};

const checkStatus = (numberCourt: string): string | null => {
    const filePath = path.join(__dirname, '../healthCheck/sitesStatus.json'); // Coloque o caminho correto para o arquivo JSON de status
    if (fs.existsSync(filePath)) {
        const statusData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        return statusData[numberCourt]?.status || null;
    }
    return null;
};

export const getData = async (caseNumber: string) => {
    try {
        const numberCourt = extractCourtNumber(caseNumber);
        if (!numberCourt) {
            throw new Error('Court number not found in the case number.');
        }

        const status = checkStatus(numberCourt);
        if (status === 'offline') {
            const consolidatedFilePath = path.join(__dirname, `../consolidated/${caseNumber}.json`);
            if (!fs.existsSync(consolidatedFilePath)) {
                throw new Error('Previous data file not found. The site is inactive and no previous data is available.');
            }
            const fileContent = fs.readFileSync(consolidatedFilePath, 'utf-8');
            return JSON.parse(fileContent);
        }

        const worker = new Worker(numberCourt, caseNumber);

        const result = await worker.performTask();

        return result;
    } catch (error) {
        return { "message": (error as Error).message, "status_code": 422 };
    }
};
