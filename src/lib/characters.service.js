import { slugify } from '../utils/slugify.js';
import { SwapiApiService } from './swapi-api.service.js';

export class CharactersService {
  constructor(
    swapiApiService
  ) {
    this.swapiApiService = swapiApiService;
  }

  async getCharacters () {
    try {
      const response = await this.swapiApiService.fetchCharacters();
      if (!response?.results?.length) return [];
      return response.results.map(this.transformCharacterData.bind(this));
    } catch (error) {
      return [];
    }
  }

  transformCharacterData (character) {
    return {
      name: character.name,
      species: character.species?.map(url => url.replace('http:', 'https:')) || [],
      height: character.height,
      mass: character.mass,
      hairColor: character.hair_color,
      birthYear: character.birth_year,
      image: this.getCharacterImage(character.name)
    };
  }

  getCharacterImage (name) {
    return `${slugify(name)}.png`;
  }
}

export default new CharactersService(new SwapiApiService());
