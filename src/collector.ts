import cron from 'node-cron';
import { Queue } from './queue/queueService'
import fs from 'fs';
import { getData } from './services/scraperService';


const mainQueue = Queue.getInstance();

cron.schedule('*/5 * * * * *', async () => {
    if (await mainQueue.isEmpty()) {
        return;
    }
    const caseNumber = await mainQueue.dequeue();

    if (caseNumber !== undefined) {
        const processedFile = await getData(caseNumber);
        const folderPath = 'src/processedFiles';
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const filePath = `${folderPath}/${caseNumber}.json`;
        fs.writeFileSync(filePath, JSON.stringify(processedFile, null, 2));
    }
    console.log(`Message processed: ${caseNumber}`)
});
