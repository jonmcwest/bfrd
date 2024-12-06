import { slugify } from './slugify.js';

describe('slugify', () => {
  it('should convert spaces to hyphens', () => {
    expect(slugify('hello world')).toBe('hello-world');
  });

  it('should convert multiple spaces to single hyphen', () => {
    expect(slugify('hello   world')).toBe('hello-world');
  });

  it('should convert to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('should handle special characters', () => {
    expect(slugify('C-3PO')).toBe('c-3po');
  });

  it('should handle leading and trailing spaces', () => {
    expect(slugify('  hello world  ')).toBe('hello-world');
  });

  it('should throw error when string is empty', () => {
    expect(() => slugify('')).toThrow('string is required');
  });

  it('should throw error when string is null', () => {
    expect(() => slugify(null)).toThrow('string is required');
  });

  it('should throw error when string is undefined', () => {
    expect(() => slugify(undefined)).toThrow('string is required');
  });
});
