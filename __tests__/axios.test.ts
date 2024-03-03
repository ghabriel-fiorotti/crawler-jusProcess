
import AxiosService from '../src/util/axios';

describe('Axios request test', () => {
    test('should return response', async () => {
        const url = 'https://www.google.com/';

        const response = await AxiosService.get(url);
        expect(response)
    });
});

describe('Website status test', () => {
    test('should return status 200 for the website', async () => {
        const url = 'https://www2.tjal.jus.br/cposg5/open.do';

        const response = await AxiosService.get(url);

        expect(response.status).toBe(200);
    });
});