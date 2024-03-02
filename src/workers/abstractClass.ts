import fs from 'fs';
import { FinalResult } from './resultTypes';

export abstract class TjCrawler {
    private logFile: string;

    constructor() {
        this.logFile = 'crawler_log.txt';

        if (!fs.existsSync(this.logFile)) {
            fs.writeFileSync(this.logFile, '', 'utf-8');
        }
    }

    protected logger: any;

    abstract getDataFirstInstance(): Promise<any>;

    abstract getDataAppellateCourt(): Promise<any>;

    abstract extractData(rawDataFirstInstace: any, rawDataAppellateCourt: any): Promise<FinalResult>;

    abstract saveData(data: any): void;

    LoggerData(caseNumber: string, message: string): void {
        const dateTime = new Date().toISOString();
        fs.appendFileSync(this.logFile, `[INFO] [${dateTime}] [Case: ${caseNumber}] ${message}\n`, 'utf-8');
    }

    LoggerError(caseNumber: string, message: string): void {
        const dateTime = new Date().toISOString();
        fs.appendFileSync(this.logFile, `[ERROR] [${dateTime}] [Case: ${caseNumber}] ${message}\n`, 'utf-8');
    }
}