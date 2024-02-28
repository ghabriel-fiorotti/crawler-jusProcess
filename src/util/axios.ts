import axios, { AxiosResponse } from 'axios';

export default class AxiosService {
  static async get(url: string): Promise<any> {
    try {
      const response: AxiosResponse = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching data');
    }
  }
}