export interface FinalResult {
    info?: string
    primeiroGrau: PrimeiroGrau
    segundoGrau: SegundoGrau
}

export interface PrimeiroGrau {
    classe: string
    area: string
    assunto: string
    dataDistribuicao: string
    juiz: string
    valorAcao: string
    partesProcesso?: Record<string, string[]>
    listaMovimentacao: ListaMovimentacaoPrimeiroGrau[]
}


export interface ListaMovimentacaoPrimeiroGrau {
    data: string
    movimento: string
    descricao: string
}

export interface SegundoGrau {
    classe: string
    area: string
    assunto: string
    dataDistribuicao: string
    juiz: string
    valorAcao: string
    partesProcesso?: Record<string, string[]>
    listaMovimentacao?: ListaMovimentacaoSegundoGrau[]
}

export interface ListaMovimentacaoSegundoGrau {
    data: string
    movimento: string
    descricao: string
}

