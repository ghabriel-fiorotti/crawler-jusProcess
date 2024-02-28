export interface CaseRequestBody {
    caseNumber: string;
}
export const urlsFirstInstance: { [key: string]: string } = {
    "02": "https://www2.tjal.jus.br/cpopg/show.do",
    "06": "https://esaj.tjce.jus.br/cpopg/show.do",
};

export const urlsAppellateCourtSearch: { [key: string]: string } = {
    "02": "https://www2.tjal.jus.br/cposg5/search.do?conversationId=&paginaConsulta=0&cbPesquisa=NUMPROC&numeroDigitoAnoUnificado=&foroNumeroUnificado=&dePesquisaNuUnificado=&dePesquisaNuUnificado=UNIFICADO&tipoNuProcesso=SAJ",
    "06": "https://esaj.tjce.jus.br/cposg5/search.do?conversationId=&paginaConsulta=0&cbPesquisa=NUMPROC&numeroDigitoAnoUnificado=&foroNumeroUnificado=&dePesquisaNuUnificado=&dePesquisaNuUnificado=UNIFICADO&tipoNuProcesso=SAJ",
};

export const urlsAppellateCourt: { [key: string]: string } = {
    "02": "https://www2.tjal.jus.br/cposg5/show.do",
    "06": "https://esaj.tjce.jus.br/cposg5/show.do",
};

export interface ResultUnify {
    primeiroGrau: PrimeiroGrau,
    segundoGrau: SegundoGrau
}

export interface PrimeiroGrau {
    classe?: string,
    area?: string,
    assunto?: string,
    dataDistribuição?: string,
    juiz?: string,
    valorAcao?: string,
    partesProcesso?: string[],
    listaMovimentação?: string[]
}

export interface SegundoGrau {
    classe?: string,
    area?: string,
    assunto?: string,
    dataDistribuição?: string,
    juiz?: string,
    valorAcao?: string,
    partesProcesso?: string[],
    listaMovimentação?: string[]
}