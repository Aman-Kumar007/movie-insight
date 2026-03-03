import { validateImdbId, sanitizeImdbId } from '@/lib/validators';

describe('validateImdbId', () => {
  it('accepts valid 7-digit IMDb IDs', () => {
    expect(validateImdbId('tt0133093')).toBe(true);
    expect(validateImdbId('tt0068646')).toBe(true);
    expect(validateImdbId('tt0111161')).toBe(true);
  });

  it('accepts valid 8-digit IMDb IDs', () => {
    expect(validateImdbId('tt10872600')).toBe(true);
  });

  it('rejects IDs without tt prefix', () => {
    expect(validateImdbId('0133093')).toBe(false);
    expect(validateImdbId('ab0133093')).toBe(false);
  });

  it('rejects IDs with fewer than 7 digits', () => {
    expect(validateImdbId('tt01330')).toBe(false);
    expect(validateImdbId('tt013')).toBe(false);
  });

  it('rejects empty strings', () => {
    expect(validateImdbId('')).toBe(false);
  });

  it('rejects IDs with letters after tt', () => {
    expect(validateImdbId('ttabcdefg')).toBe(false);
  });

  it('handles whitespace correctly', () => {
    expect(validateImdbId('  tt0133093  ')).toBe(true);
  });
});

describe('sanitizeImdbId', () => {
  it('trims whitespace', () => {
    expect(sanitizeImdbId('  tt0133093  ')).toBe('tt0133093');
  });

  it('converts to lowercase', () => {
    expect(sanitizeImdbId('TT0133093')).toBe('tt0133093');
  });
});
