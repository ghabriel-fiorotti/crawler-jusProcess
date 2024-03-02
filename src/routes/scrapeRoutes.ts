import { Router } from 'express';
import { scrapeController, getDataController } from '../controllers/scrapeController';

const router = Router();

router.post('/', scrapeController);
router.get('/showData/:caseNumber', getDataController);


export { router };
