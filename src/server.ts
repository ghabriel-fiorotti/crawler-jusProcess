import { app } from './app';
import dotenv from 'dotenv';

dotenv.config();

const port: number = parseInt(process.env.PORT || '3000', 10); // Defina o tipo para 'port'

const server = app.listen(port, () => console.log(`Server running on port ${port}.`));

process.on('SIGINT', ()=> {
    server.close();
    console.log('Application shut down.');
});