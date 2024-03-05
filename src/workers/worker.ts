import fs from 'fs';
import { crawlerMap } from './servicesName';
import { PrimeiroGrau } from './resultTypes';

class Worker {
    public numberCourt: string;
    public caseNumber: string;

    constructor(numberCourt: string, caseNumber: string) {
        this.numberCourt = numberCourt;
        this.caseNumber = caseNumber;
    }

    async performTask(): Promise<any> {
        try {
            if (this.numberCourt in crawlerMap) {
                const CrawlerClass = crawlerMap[this.numberCourt];
                const crawler = new CrawlerClass(this.numberCourt, this.caseNumber);

                const rawDataFirstInstance: PrimeiroGrau = await crawler.getDataFirstInstance(this.numberCourt);
                const rawDataAppellateCourt = await crawler.getDataAppellateCourt(this.numberCourt);
                let extractedData = await crawler.extractData(rawDataFirstInstance, rawDataAppellateCourt);

                const validObject = this.validObject(extractedData.primeiroGrau)

                if(!validObject){
                    extractedData = {
                        info: "Process not found"
                    }
                }

                const folderPath = 'src/consolidated';
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath, { recursive: true });
                }

                const filePath = `${folderPath}/${this.caseNumber}.json`;
                fs.writeFileSync(filePath, JSON.stringify(extractedData, null, 2));

                return extractedData;
            } else {
                throw new Error('Task number not supported');
            }
        } catch (error) {
            throw new Error(`Error performing task: ${error}`);
        }
    }

    validObject(firstInstance: PrimeiroGrau): boolean {
        const existPartsProcess = firstInstance.listaMovimentacao.length ? true : false;
        const classProcess = firstInstance.classe == "" ? false : true;
        if (existPartsProcess && classProcess) {
            return true
        }
        return false;
    }
}



export { Worker };