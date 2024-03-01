import { TjalCrawler } from './crawler/tjal/crawler';
import { TjceCrawler } from './crawler/tjce/crawler';

export const crawlerMap: { [key: string]: any } = {
    '02': TjalCrawler,
    '06': TjceCrawler
};