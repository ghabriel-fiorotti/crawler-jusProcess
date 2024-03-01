import express, { Express } from 'express'; 
import cors from 'cors';
import logger from 'morgan';
import { router } from './routes/scrapeRoutes';

export const app: Express = express(); 
app.use(express.json());
app.use(cors());
app.use(logger('dev'));

app.get('/', (req, res) => res.send('API currently running'));
app.use('/scraper', router);