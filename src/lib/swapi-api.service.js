import { HttpService } from './http.service';

export class SwapiApiService extends HttpService {
  async fetchCharacters (maxRetries = 3) {
    const response = await this.retryFetch('https://swapi.dev/api/people/', maxRetries);
    return response?.json() ?? {};
  }
}