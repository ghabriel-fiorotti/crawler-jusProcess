import fs from 'fs';
const path = require("path");


const QUEUE_FILE_PATH = path.resolve(__dirname, "./queue.txt");

export class Queue {
    private static instance: Queue;

    private constructor() {
        this.initializeQueueFile();
    }

    public static getInstance(): Queue {
        if (!Queue.instance) {
            Queue.instance = new Queue();
        }
        return Queue.instance;
    }

    private getPositionInQueue(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            fs.readFile(QUEUE_FILE_PATH, 'utf8', (err, data) => {
                if (err) {
                    console.error('Failed to read queue file:', err);
                    reject(err);
                } else {
                    const lines = data.split('\n').filter(line => line.trim() !== '');
                    resolve(lines.length);
                }
            });
        });
    }


    enqueue(item: string): Promise<{ message: string, url: string }> {
        return new Promise<{ message: string, url: string }>((resolve, reject) => {
            fs.appendFile(QUEUE_FILE_PATH, JSON.stringify(item) + '\n', async (err) => {
                if (err) {
                    console.error('Failed to enqueue item:', err);
                    reject(err);
                } else {
                    try {
                        const positionQueue = await this.getPositionInQueue();
                        const message = `Task sent to the execution queue, its position in the queue is: ${positionQueue}. Execute the GET URL below in ${10 * positionQueue} seconds to retrieve the information:`;
                        console.log('Item enqueued:', item);
                        resolve({ message, url: `http://localhost:${process.env.PORT}/scraper/showData/${item}` });
                    } catch (error) {
                        console.error('Failed to get position in queue:', error);
                        reject(error);
                    }
                }
            });
        });
    }

    async dequeue(): Promise<string | undefined> {
        const lines = await this.readQueueFileLines();
        if (lines.length > 0) {
            const item = JSON.parse(lines[0]) as string;
            await this.removeFirstLineFromFile();
            console.log('Item dequeued:', item);
            return item;
        } else {
            console.log('The queue is empty.');
            return undefined;
        }
    }

    async peek(): Promise<string | undefined> {
        const lines = await this.readQueueFileLines();
        if (lines.length > 0) {
            const item = JSON.parse(lines[0]) as string;
            console.log('Next item in the queue:', item);
            return item;
        } else {
            console.log('The queue is empty.');
            return undefined;
        }
    }

    async isEmpty(): Promise<boolean> {
        const lines = await this.readQueueFileLines();
        return lines.length === 0;
    }

    private initializeQueueFile(): void {
        if (!fs.existsSync(QUEUE_FILE_PATH)) {
            fs.writeFileSync(QUEUE_FILE_PATH, '');
            console.log('Queue file created:', QUEUE_FILE_PATH);
        }
    }

    private readQueueFileLines(): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            fs.readFile(QUEUE_FILE_PATH, 'utf8', (err, data) => {
                if (err) {
                    console.error('Failed to read queue file:', err);
                    reject(err);
                } else {
                    const lines = data.split('\n').filter(line => line.trim() !== '');
                    resolve(lines);
                }
            });
        });
    }

    private removeFirstLineFromFile(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            fs.readFile(QUEUE_FILE_PATH, 'utf8', (err, data) => {
                if (err) {
                    console.error('Failed to read queue file:', err);
                    reject(err);
                } else {
                    const lines = data.split('\n').slice(1).join('\n');
                    fs.writeFile(QUEUE_FILE_PATH, lines, 'utf8', (err) => {
                        if (err) {
                            console.error('Failed to write queue file:', err);
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }
            });
        });
    }
}
