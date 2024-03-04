import { TjalCrawler } from '../../src/workers/crawler/tjal/crawler';
import { PrimeiroGrau, SegundoGrau } from '../../src/workers/resultTypes';
import fs from 'fs';
import path from 'path';

describe('TjalCrawler test', () => {
    test('getDataFirstInstance should return scraped data for first instance', async () => {
        const numberCourt = '02';
        const caseNumber = '0710802-55.2018.8.02.0001';
        const crawler = new TjalCrawler(numberCourt, caseNumber);

        const scrapedData = await crawler.getDataFirstInstance();

        expect(typeof scrapedData).toBe('string');
    });

    test('getDataAppellateCourt should return scraped data for appellate court', async () => {
        const numberCourt = '02';
        const caseNumber = '0710802-55.2018.8.02.0001';
        const crawler = new TjalCrawler(numberCourt, caseNumber);

        const scrapedData = await crawler.getDataAppellateCourt();

        expect(typeof scrapedData).toBe('object');
    });

    test('extractData should return final result', async () => {
        const htmlFirstInstancePath = path.resolve(__dirname, '../extract/htmlFirstInstance.txt');
        const htmlAppellateCourtPath = path.resolve(__dirname, '../extract/htmlAppellateCourt.txt');

        const rawDataFirstInstance = fs.readFileSync(htmlFirstInstancePath, 'utf8');
        const rawDataAppellateCourt = fs.readFileSync(htmlAppellateCourtPath, 'utf8');

        const appellateCourtMock = {
            "P00006BXP0000": rawDataAppellateCourt
        }

        const numberCourt = '02';
        const caseNumber = '0710802-55.2018.8.02.0001';

        const crawler = new TjalCrawler(numberCourt, caseNumber);

        const finalResult = await crawler.extractData(rawDataFirstInstance, appellateCourtMock);

        expect(finalResult).toBeDefined();

        expect(finalResult.primeiroGrau).toEqual<PrimeiroGrau>({
            classe: expect.any(String),
            area: expect.any(String),
            assunto: expect.any(String),
            dataDistribuicao: expect.any(String),
            juiz: expect.any(String),
            valorAcao: expect.any(String),
            partesProcesso: expect.objectContaining({}),
            listaMovimentacao: expect.arrayContaining([])
        });

        expect(finalResult.segundoGrau).toEqual(expect.objectContaining({
            "P00006BXP0000": {
                classe: expect.any(String),
                area: expect.any(String),
                assunto: expect.any(String),
                dataDistribuicao: expect.any(String),
                juiz: expect.any(String),
                valorAcao: expect.any(String),
                partesProcesso: expect.objectContaining({}),
                listaMovimentacao: expect.arrayContaining([])
            }
        }));
    });
});