# API de Consulta de Processos Judiciais

Este é um projeto que consiste em uma API para consulta de dados de processos judiciais nos Tribunais de Justiça de Alagoas (TJAL) e do Ceará (TJCE). Contanto, podendo ser escalável facilmente para outros Tribunais de Justiça.

## Descrição

Esta API permite que os usuários obtenham informações sobre processos judiciais a partir de seus números. Os dados são coletados dos sites dos tribunais mencionados e retornados ao usuário em formato JSON.

## Como Executar

### Requisitos

Para executar esta aplicação, certifique-se de ter o Node.js e o npm instalados em seu sistema.

- [Node.js](https://nodejs.org/) (v16.x ou superior)
- [npm](https://www.npmjs.com/) (v8.x ou superior)

### Instalação das Dependências

1. Clone este repositório:

```bash
git clone https://github.com/ghabriel-fiorotti/crawler-jusProcess.git
```

2. Navegue até o diretório do projeto:

```bash
cd crawler-jusProcess
```

3. Instale as dependências:

```bash
npm install
```

### Configuração

Antes de iniciar a aplicação, é necessário configurar as variáveis de ambiente. Siga estes passos:

1. Crie um novo arquivo chamado `.env` no diretório raiz do projeto.
2. Abra o arquivo `.env.example` em um editor de texto.
3. Copie o conteúdo do arquivo `.env.example`.
4. Cole o conteúdo no arquivo `.env` recém-criado.
5. Preencha as variáveis com os valores apropriados.
6. Salve o arquivo `.env`.

Isso garantirá que a aplicação tenha as configurações corretas para funcionar corretamente.

### Execução

Existem duas maneiras de executar a aplicação, dependendo do valor da variável de ambiente `USE_QUEUE`.

#### Se `USE_QUEUE=false`:

Para iniciar a aplicação, execute o seguinte comando no terminal:

```
npm run start
```

Isso iniciará o servidor Express.

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

#### Se `USE_QUEUE=true`:

Para iniciar a aplicação com fila, execute o seguinte comando no terminal:

```
npm run start-with-queue
```

Isso iniciará o servidor Express com a utilização de fila.

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

| Número da Rota | Método HTTP | Rota                                | Rota Completa                                            |
| -------------- | ----------- | ----------------------------------- | -------------------------------------------------------- |
| 1              | POST        | /scraper                            | http://localhost:3000/scraper                            |
| 2              | GET         | /scraper/showData/{numero_processo} | http://localhost:3000/scraper/showData/{numero_processo} |

#### Exemplo do Corpo em JSON para a Rota 1:

Para a rota 1, você deve enviar um objeto JSON no corpo da solicitação com a seguinte estrutura:

```json
{
    "caseNumber": "XXXXXXX-XX.XXXX.X.XX.XXXX"
}
```

Certifique-se de substituir todos os "X" por valores numéricos reais, e o formato deve ser exatamente como mostrado.

Observação:
Caso esteja utilizando o método de execução com fila, você deve enviar uma solicitação POST conforme descrita acima e, logo após, executar a rota 2.

Substitua {numero_processo} pelo número real do processo que deseja consultar.

## Observação Geral

Neste projeto, não foi utilizado nenhum tipo de banco de dados ou armazenamento de arquivos externos para facilitar a execução. No entanto, o código foi desenvolvido de forma modular e pode ser facilmente adaptado para integrar qualquer tipo de armazenamento necessário.

## Licença

Este projeto está licenciado sob a [Licença MIT Modificada](#).

### Licença MIT Modificada

Este projeto é licenciado sob os termos da Licença MIT Modificada. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

A Licença MIT Modificada é uma variante da Licença MIT que adiciona uma cláusula de não redistribuição, restringindo a redistribuição do código sem a permissão do proprietário. Isso permite que outros usem, modifiquem e distribuam o código, mas não o redistribuam sem autorização.

```
