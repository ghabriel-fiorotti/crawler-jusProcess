import AxiosService from '../util/axios';
import cheerio from 'cheerio';
import { urlsFirstInstance, urlsAppellateCourtSearch, urlsAppellateCourt, ResultUnify, PrimeiroGrau, SegundoGrau } from './types/scraperTypes';

const extractCourtNumber = (caseNumber: string): string | null => {
    const regex = /\.8\.(\d+)\./;
    const match = regex.exec(caseNumber);
    return match && match[1] ? match[1] : null;
};

const extractPrimeiroGrau = async (caseNumber: string, numberCourt: string): Promise<PrimeiroGrau> => {
    const urlFirstInstance = urlsFirstInstance[numberCourt];
    if (!urlFirstInstance) {
        throw new Error(`URL corresponding to court ${numberCourt} not found.`);
    }
    const completedUrlFirstIntance = `${urlFirstInstance}?processo.numero=${caseNumber}`;

    const scrapedHtmlPrimeiroGrau = await AxiosService.get(completedUrlFirstIntance);

    const $ = cheerio.load(scrapedHtmlPrimeiroGrau);
    const classeProcesso = $('#classeProcesso').text();

    const resultFirsInstance: PrimeiroGrau = {
        classe: classeProcesso
    }
    return resultFirsInstance;
};

const extractSegundoGrau = async (caseNumber: string, numberCourt: string): Promise<SegundoGrau> => {
    const urlAppellateCourtSearch = urlsAppellateCourtSearch[numberCourt];
    if (!urlAppellateCourtSearch) {
        throw new Error(`URL corresponding to court ${numberCourt} not found.`);
    }
    const completedUrlApellateCourtSearch = `${urlAppellateCourtSearch}&dePesquisa=${caseNumber}`;

    const scrapedHtmlSegundoGrauSearch = await AxiosService.get(completedUrlApellateCourtSearch);

    let $ = cheerio.load(scrapedHtmlSegundoGrauSearch);
    const codeProcess = $('input[type="radio"][name="processoSelecionado"]').first().attr('value');

    const urlAppellateCourt = urlsAppellateCourt[numberCourt];
    if (!urlAppellateCourt) {
        throw new Error(`URL corresponding to court ${numberCourt} not found.`);
    }
    console.log('aqui', codeProcess)
    const completedUrlApellateCourt = `${urlAppellateCourt}?processo.codigo=${codeProcess}`;

    console.log(completedUrlApellateCourt)
    const scrapedHtmlSegundoGrau = await AxiosService.get(completedUrlApellateCourt);

    $ = cheerio.load(scrapedHtmlSegundoGrau);

    const classeProcesso = $('#classeProcesso').text();

    const resultAppellateCourt: SegundoGrau = {
        classe: classeProcesso
    }
    return resultAppellateCourt;
};


export const scrapeData = async (caseNumber: string) => {
    try {
        const numberCourt = extractCourtNumber(caseNumber);
        if (!numberCourt) {
            throw new Error('Court number not found in the case number.');
        }

        const primeiroGrau = await extractPrimeiroGrau(caseNumber, numberCourt);
        const segundoGrau = await extractSegundoGrau(caseNumber, numberCourt);

        const result: ResultUnify = { primeiroGrau, segundoGrau };

        return result;
    } catch (error) {
        return { "message": (error as Error).message, "status_code": 422 };
    }
};

