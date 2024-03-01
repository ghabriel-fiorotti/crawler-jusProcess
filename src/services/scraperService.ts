import { Worker } from '../workers/worker';

const extractCourtNumber = (caseNumber: string): string | null => {
    const regex = /\.8\.(\d+)\./;
    const match = regex.exec(caseNumber);
    return match && match[1] ? match[1] : null;
};

export const getData = async (caseNumber: string) => {
    try {
        const numberCourt = extractCourtNumber(caseNumber);
        if (!numberCourt) {
            throw new Error('Court number not found in the case number.');
        }

        const worker = new Worker(numberCourt, caseNumber);

        const result = await worker.performTask();

        return result;
    } catch (error) {
        return { "message": (error as Error).message, "status_code": 422 };
    }
};