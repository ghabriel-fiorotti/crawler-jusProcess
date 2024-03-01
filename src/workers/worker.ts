import { crawlerMap } from './servicesName';

class Worker {
    public numberCourt: string;
    public caseNumber: string;

    constructor(numberCourt: string, caseNumber: string) {
        this.numberCourt = numberCourt;
        this.caseNumber = caseNumber
    }

    async performTask(): Promise<any> {
        try {
            if (this.numberCourt in crawlerMap) {
                const CrawlerClass = crawlerMap[this.numberCourt];
                const crawler = new CrawlerClass(this.numberCourt, this.caseNumber);

                const rawDataFirstInstance = await crawler.getDataFirstInstance(this.numberCourt);
                const rawDataAppellateCourt = await crawler.getDataAppellateCourt(this.numberCourt);
                const extractedData = await crawler.extractData(rawDataFirstInstance, rawDataAppellateCourt);
                await crawler.saveData(extractedData);
                return extractedData;
            } else {
                throw new Error('Task number not supported');
            }
        } catch (error) {
            throw new Error(`Error performing task: ${error}`);
        }
    }
}

export { Worker };