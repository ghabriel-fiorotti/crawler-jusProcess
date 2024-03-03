# API de Consulta de Processos Judiciais

Este é um projeto que consiste em uma API para consulta de dados de processos judiciais nos Tribunais de Justiça de Alagoas (TJAL) e do Ceará (TJCE). Contanto, podendo ser escalável facilmente para outros Tribunais de Justiça.

## Descrição

Esta API permite que os usuários obtenham informações sobre processos judiciais a partir de seus números. Os dados são coletados dos sites dos tribunais mencionados e retornados ao usuário em formato JSON.

## Como Executar

### Requisitos

Para executar esta aplicação, certifique-se de ter o Node.js e o npm instalados em seu sistema.

- [Node.js](https://nodejs.org/) (v14.x ou superior)
- [npm](https://www.npmjs.com/) (v6.x ou superior)

### Instalação das Dependências

1. Clone este repositório:

````bash
git clone https://github.com/ghabriel-fiorotti/crawler-jusProcess.git

1. Clone este repositório:

```bash
git clone https://github.com/ghabriel-fiorotti/crawler-jusProcess.git
````

2. Navegue até o diretório do projeto:

```bash
cd crawler-jusProcess
```

3. Instale as dependências:

```bash
npm install
```

### Configuração

Não é necessária nenhuma configuração adicional para executar a aplicação.

### Execução

Para iniciar a aplicação, execute o seguinte comando no terminal:

```bash
npm run start
```

Isso iniciará o servidor Express.

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

## Uso

Existem duas formas de utilizar a API:

1. **Acesso direto**: Utilize uma ferramenta como o Postman ou faça requisições HTTP diretamente. Envie um JSON contendo o número do processo para a rota apropriada e a API retornará os dados do processo consultado.

2. **Uso com fila**: Se preferir, você pode configurar a API para trabalhar no modelo de fila. Para isso, defina a variável de ambiente `USE_QUEUE=true`. Após fazer isso, siga os seguintes passos:

   - Envie uma solicitação POST para a rota `/scraper` com o número do processo no corpo da requisição.
   - Após receber a resposta, aguarde o tempo informado na resposta.
   - Execute a rota também informada na resposta para obter os dados do processo consultado.

### Rotas da API

Aqui estão as rotas disponíveis na API:

| Número do Processo | Método HTTP | Rota                                |
| ------------------ | ----------- | ----------------------------------- |
| 1                  | POST        | /scraper                            |
| 2                  | GET         | /scraper/showData/{numero_processo} |

Substitua `{numero_processo}` pelo número real do processo que deseja consultar.
