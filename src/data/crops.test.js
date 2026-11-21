import { describe, it, expect } from 'vitest';
import { CROPS, getCrop } from './crops.js';

describe('getCrop', () => {
  it('returns the maize record on a hit', () => {
    const maize = getCrop('maize');
    expect(maize).toBeDefined();
    expect(maize.name).toBe('Maize');
  });

  it('returns undefined on a miss', () => {
    expect(getCrop('nope')).toBeUndefined();
  });

  it('every slug is lower-case and unique', () => {
    const slugs = CROPS.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    slugs.forEach((s) => expect(s).toBe(s.toLowerCase()));
  });
});


