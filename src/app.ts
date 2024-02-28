import express, { Express } from 'express'; // Importe 'Express' do 'express'
import cors from 'cors';
import logger from 'morgan';
import { router } from './routes/scrapeRoutes';

export const app: Express = express(); // Defina o tipo para 'app'

app.use(express.json());
app.use(cors());
app.use(logger('dev'));

app.get('/', (req, res) => res.send('API currently running')); // Defina o tipo para 'req' e 'res'
app.use('/scraper', router);