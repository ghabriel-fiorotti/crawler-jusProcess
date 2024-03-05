import AxiosService from '../../../util/axios';
import cheerio from 'cheerio';
import { urlsFirstInstance, urlAppellateCourtSearch, urlAppellateCourt, AxiosDataAppellateCourt, FinalResult } from './types/scraperTypes';
import { TjCrawler } from '../../abstractClass';
import { Info, PrimeiroGrau, SegundoGrau } from '../../resultTypes';

export class TjceCrawler extends TjCrawler {
    private caseNumber: string;
    private numberCourt: string;
    constructor(numberCourt: string, caseNumber: string) {
        super();
        this.caseNumber = caseNumber;
        this.numberCourt = numberCourt;

    }

    async getDataFirstInstance(): Promise<string> {
        try {
            const urlFirstInstance = urlsFirstInstance;

            if (!urlFirstInstance) {
                throw new Error(`URL corresponding to court ${this.numberCourt} not found.`);
            }
            const completedUrlFirstIntance = `${urlFirstInstance}?processo.numero=${this.caseNumber}`;

            const scrapedHtmlPrimeiroGrau = await AxiosService.get(completedUrlFirstIntance);


            this.LoggerData(this.caseNumber, "Request successfully made")

            return scrapedHtmlPrimeiroGrau.data;
        } catch (error) {
            this.LoggerError(this.caseNumber, `Error fetching data: ${error}`);
            throw new Error('Failed to fetch data.');
        }
    }

    async getDataAppellateCourt(): Promise<AxiosDataAppellateCourt> {
        try {
            if (!urlAppellateCourtSearch) {
                throw new Error(`URL corresponding to court ${this.numberCourt} not found.`);
            }
            const completedUrlAppellateCourtSearch = `${urlAppellateCourtSearch}&dePesquisa=${this.caseNumber}`;

            const scrapedHtmlSegundoGrauSearch = await AxiosService.get(completedUrlAppellateCourtSearch);
            let $ = cheerio.load(scrapedHtmlSegundoGrauSearch.data);
            const codeProcess = $('input[type="radio"][name="processoSelecionado"]').first().attr('value');

            let jsonData: { [key: string]: any } = {};

            if (!codeProcess) {

                const codes: string[] = [];

                $('div[id^="divProcesso"]').each(async (index, element) => {
                    const id = $(element).attr('id');
                    if (id) {
                        const code = id.replace('divProcesso', '');
                        codes.push(code);
                    }
                });

                if (codes.length == 0) {
                    jsonData = {
                        [this.caseNumber]: scrapedHtmlSegundoGrauSearch.data
                    };

                    return jsonData;
                }

                for (const codeProcess of codes) {
                    if (!urlAppellateCourt) {
                        throw new Error(`URL corresponding to court ${this.numberCourt} not found.`);
                    }
                    const completedUrlAppellateCourt = `${urlAppellateCourt}?processo.codigo=${codeProcess}`;

                    try {
                        const scrapedHtmlSegundoGrau = await AxiosService.get(completedUrlAppellateCourt);
                        jsonData[codeProcess] = scrapedHtmlSegundoGrau.data;

                    } catch (error) {
                        console.error(`Error fetching data for process code ${codeProcess}: ${error}`);
                        jsonData[codeProcess] = null;
                    }
                }
                return jsonData;
            }
            else {
                if (!urlAppellateCourt) {
                    throw new Error(`URL corresponding to court ${this.numberCourt} not found.`);
                }
                const completedUrlAppellateCourt = `${urlAppellateCourt}?processo.codigo=${codeProcess}`;
                const scrapedHtmlSegundoGrau = await AxiosService.get(completedUrlAppellateCourt);

                jsonData = {
                    [codeProcess]: scrapedHtmlSegundoGrau.data
                };

                return jsonData;
            }
        } catch (error) {
            this.LoggerError(this.caseNumber, `Error fetching data: ${error}`);
            throw new Error('Failed to fetch data.');
        }
    }

    async extractData(rawDataFirstInstace: string, rawDataAppellateCourt: AxiosDataAppellateCourt): Promise<FinalResult> {
        try {
            const primeiroGrau = await this.extractDataFirstInstance(rawDataFirstInstace)
            const segundoGrau: SegundoGrau = await this.extractDataAppellateCourt(rawDataAppellateCourt);

            return { primeiroGrau, segundoGrau };
        } catch (error) {
            this.LoggerError(this.caseNumber, `Error extracting data: ${error}`);
            throw new Error('Failed to extract data.');
        }
    }

    async extractDataFirstInstance(rawDataFirstInstace: string): Promise<PrimeiroGrau> {
        const $ = cheerio.load(rawDataFirstInstace);

        const classe = $('#classeProcesso').text();
        const area = $('#areaProcesso span').text();
        const assunto = $('#assuntoProcesso').text();
        const dataDistribuicao = $('#dataHoraDistribuicaoProcesso').text().split(' -')[0];
        const juiz = $('#juizProcesso').text();
        const valorAcao = $('#valorAcaoProcesso').text().replace(/\s+/g, ' ');

        const partesProcesso: { [key: string]: string[] } = {};
        let table = $('#tableTodasPartes');

        if (!table.length) {
            table = $('#tablePartesPrincipais');
        }

        table.find('tr').each((index, element) => {
            const type = $(element).find('.tipoDeParticipacao').text().trim();
            const name = $(element).find('.nomeParteEAdvogado').text().trim();
            if (type && name) {
                const cleanName = name.replace(/\n|\t/g, '').replace(/\s+/g, ' ');
                const partes = cleanName.split(/\b(?=\w+:)/);
                const names = partes.map(parte => parte.trim());

                if (partesProcesso[type]) {
                    partesProcesso[type].push(...names);
                } else {
                    partesProcesso[type] = [...names];
                }
            }
        });

        const listaMovimentacao: { data: string; movimento: string; descricao: string; }[] = [];

        $('#tabelaTodasMovimentacoes .containerMovimentacao').each((index, element) => {
            const dataMovimentacao = $(element).find('.dataMovimentacao').text().trim();

            const movimentoElement = $(element).find('.descricaoMovimentacao').find('a');
            const movimento = movimentoElement.text().trim() || $(element).find('.descricaoMovimentacao').contents().eq(0).text().trim();

            const descricao = $(element).find('.descricaoMovimentacao').find('span[style="font-style: italic;"]').text().trim();

            const movimentacao = {
                data: dataMovimentacao,
                movimento: movimento,
                descricao: descricao
            };

            listaMovimentacao.push(movimentacao);
        });

        const result: PrimeiroGrau = {
            classe,
            area,
            assunto,
            dataDistribuicao,
            juiz,
            valorAcao,
            partesProcesso,
            listaMovimentacao
        };

        this.LoggerData(this.caseNumber, "Extraction successfully completed.")

        return result;

    }

    async extractDataAppellateCourt(rawDataAppellateCourt: AxiosDataAppellateCourt): Promise<SegundoGrau> {
        const processedData: { [key: string]: Info } = {};

        for (const idProcess in rawDataAppellateCourt) {
            const rawData = rawDataAppellateCourt[idProcess];
            const $ = cheerio.load(rawData);

            const classe = $('#classeProcesso').text();
            const area = $('#areaProcesso span').text();
            const assunto = $('#assuntoProcesso').text();
            const dataDistribuicao = $('#dataHoraDistribuicaoProcesso').text().split(' -')[0];
            const juiz = $('#juizProcesso').text();
            const valorAcao = $('#valorAcaoProcesso').text().replace(/\s+/g, ' ');

            const partesProcesso: { [key: string]: string[] } = {};
            let table = $('#tableTodasPartes');

            if (!table.length) {
                table = $('#tablePartesPrincipais');
            }

            table.find('tr').each((index, element) => {
                const type = $(element).find('.tipoDeParticipacao').text().trim();
                const name = $(element).find('.nomeParteEAdvogado').text().trim();
                if (type && name) {
                    const cleanName = name.replace(/\n|\t/g, '').replace(/\s+/g, ' ');
                    const partes = cleanName.split(/\b(?=\w+:)/);
                    const names = partes.map(parte => parte.trim());

                    if (partesProcesso[type]) {
                        partesProcesso[type].push(...names);
                    } else {
                        partesProcesso[type] = [...names];
                    }
                }
            });

            const listaMovimentacao: { data: string; movimento: string; descricao: string; }[] = [];

            let $table = $('#tabelaTodasMovimentacoes');
            if ($table.length === 0) {
                $table = $('#tabelaUltimasMovimentacoes');
            }
            $table.find('tr').each((index, element) => {
                const data = $(element).find('.dataMovimentacaoProcesso').text().trim();
                let movimento = $(element).find('.descricaoMovimentacaoProcesso').contents().first().text().trim();

                if ($(element).find('.descricaoMovimentacaoProcesso').find('a').length > 0) {
                    movimento = $(element).find('.descricaoMovimentacaoProcesso').find('a').text().trim();
                }
                let descricao = $(element).find('.descricaoMovimentacaoProcesso').find('span').text().trim();
                descricao = descricao.replace(/\s+/g, ' ').trim();
                listaMovimentacao.push({ data, movimento, descricao });
            });

            const result: Info = {
                classe,
                area,
                assunto,
                dataDistribuicao,
                juiz,
                valorAcao,
                partesProcesso,
                listaMovimentacao
            };

            processedData[idProcess] = result;
        }

        return processedData;
    }

    /* Method created in case it's necessary to save the collected data in another storage.*/
    async saveData(data: any): Promise<void> {
        try {
            console.log(data);
        } catch (error) {
            this.LoggerError(this.caseNumber, `Error saving data: ${error}`);
            throw new Error('Failed to save data.');
        }
    }
}
