import { CharactersService } from './characters.service';

describe('CharactersService', () => {
  let charactersService;
  let mockSwapiApiService;

  beforeEach(() => {
    mockSwapiApiService = {
      fetchCharacters: jest.fn()
    };
    charactersService = new CharactersService(mockSwapiApiService);
  });

  describe('getCharacters', () => {
    it('should return transformed character data when API call is successful', async () => {

      const mockApiResponse = {
        ok: true,
        status: 200,
        results: [{
          name: 'Luke Skywalker',
          species: ['https://swapi.dev/api/species/1'],
          height: '172',
          mass: '77',
          hair_color: 'blond',
          birth_year: '19BBY'
        }]
      };


      mockSwapiApiService.fetchCharacters = jest.fn().mockImplementation(() =>
        Promise.resolve(mockApiResponse)
      );

      const result = await charactersService.getCharacters();

      expect(result).toEqual([{
        name: 'Luke Skywalker',
        species: ['https://swapi.dev/api/species/1'],
        height: '172',
        mass: '77',
        hairColor: 'blond',
        birthYear: '19BBY',
        image: 'luke-skywalker.png'
      }]);
    });

    it('should return empty array when API call fails', async () => {
      mockSwapiApiService.fetchCharacters.mockRejectedValue(new Error('API Error'));

      const result = await charactersService.getCharacters();

      expect(result).toEqual([]);
    });

    it('should return empty array when response has no results', async () => {
      mockSwapiApiService.fetchCharacters.mockResolvedValue({});

      const result = await charactersService.getCharacters();

      expect(result).toEqual([]);
    });
  });

  describe('transformCharacterData', () => {
    it('should transform character data correctly', () => {
      const input = {
        name: 'Luke Skywalker',
        species: ['http://swapi.dev/api/species/1'],
        height: '172',
        mass: '77',
        hair_color: 'blond',
        birth_year: '19BBY'
      };

      const result = charactersService.transformCharacterData(input);

      expect(result).toEqual({
        name: 'Luke Skywalker',
        species: ['https://swapi.dev/api/species/1'],
        height: '172',
        mass: '77',
        hairColor: 'blond',
        birthYear: '19BBY',
        image: 'luke-skywalker.png'
      });
    });

    it('should handle missing species data', () => {
      const input = {
        name: 'Luke Skywalker',
        height: '172',
        mass: '77',
        hair_color: 'blond',
        birth_year: '19BBY'
      };

      const result = charactersService.transformCharacterData(input);

      expect(result.species).toEqual([]);
    });
  });

  describe('getCharacterImage', () => {
    it('should return correct image filename', () => {
      const result = charactersService.getCharacterImage('Luke Skywalker');
      expect(result).toBe('luke-skywalker.png');
    });
  });
});