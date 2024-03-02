import axios, { AxiosResponse, AxiosProxyConfig } from 'axios';

export default class AxiosService {

  private static proxies: { host: string, port?: number }[] = [
    { host: 'datacenter.example.com', port: 80 },
    { host: 'unlocker.example.com', port: 80 },
    { host: 'residential.example.com', port: 80 }
  ];

  static async get(url: string): Promise<any> {
    try {
      const response: AxiosResponse = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching data');
    }
  }

  /*  Here is a simple example of using proxies, however, with simulated values. 
     In case it is necessary to use them in the future. However, in this project,
     requests are being made without a proxy.

      Additionally, the values are hardcoded in the code. In production, it is more
     appropriate to create a task definition for each situation.
  */

  private static currentProxyIndex: number = 0;

  static async getWithProxy(url: string): Promise<any> {
    try {
      const proxyConfig: AxiosProxyConfig = {
        host: this.proxies[this.currentProxyIndex].host,
        port: this.proxies[this.currentProxyIndex].port || 80
      };
      const response: AxiosResponse = await axios.get(url, { proxy: proxyConfig });
      return response.data;
    } catch (error) {
      this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxies.length;
      throw new Error('Error fetching data. Trying next proxy.');
    }
  }
}
