export const urlsFirstInstance = "https://esaj.tjce.jus.br/cpopg/show.do";
export const urlAppellateCourtSearch = "https://esaj.tjce.jus.br/cposg5/search.do?conversationId=&paginaConsulta=0&cbPesquisa=NUMPROC&numeroDigitoAnoUnificado=&foroNumeroUnificado=&dePesquisaNuUnificado=&dePesquisaNuUnificado=UNIFICADO&tipoNuProcesso=SAJ";
export const urlAppellateCourt = "https://esaj.tjce.jus.br/cposg5/show.do";

export interface ResultUnify {
    primeiroGrau: PrimeiroGrau,
    segundoGrau: SegundoGrau
}

export interface PrimeiroGrau {
    classe?: string,
    area?: string,
    assunto?: string,
    dataDistribuicao?: string,
    juiz?: string,
    valorAcao?: string,
    partesProcesso?: Record<string, string[]>,
    listaMovimentacao?: { data: string; movimento: string; }[]
}

export interface SegundoGrau {
    classe?: string,
    area?: string,
    assunto?: string,
    dataDistribuicao?: string,
    juiz?: string,
    valorAcao?: string,
    partesProcesso?: Record<string, string[]>,
    listaMovimentacao?: { data: string; movimento: string; }[]
}