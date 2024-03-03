
import { extractCourtNumber } from "../src/services/scraperService";

describe('extract court number in case number', () => {
    test('should return court number', async () => {
        const caseNumber = '0710802-55.2018.8.02.0001';

        const response = extractCourtNumber(caseNumber);

        expect(response).toBe('02');
    });
});