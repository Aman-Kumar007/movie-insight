import { getMovieReviews, generateFallbackReviews } from '@/lib/reviews';
import type { Review } from '@/lib/types';

describe('movie reviews helper', () => {
  const sampleInput = { imdbId: 'tt1234567', title: 'Some Movie', genre: 'Drama', plot: 'Stuff happens.' }; 

  const sixReviews: Review[] = [
    { author: 'Alice', content: 'Great film!' },
    { author: 'Bob', content: 'Could be better.' },
    { author: 'Carol', content: 'Mediocre at best.' },
    { author: 'Dan', content: 'Absolutely loved it.' },
    { author: 'Eve', content: 'Not my cup of tea.' },
    { author: 'Frank', content: 'A must-watch for fans.' },
  ];
  // helper that mimics the Groq chat response structure
  function makeChatResponse(content: string) {
    return { choices: [{ message: { content } }] };
  }

  beforeEach(() => {
    // ensure the API key check passes for tests
    process.env.GROQ_API_KEY = 'test-key';

    // reset fetch mock
    // @ts-ignore
    global.fetch = jest.fn();
  });

  it('returns reviews when AI responds with six valid entries', async () => {
    // @ts-ignore
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => makeChatResponse(`Here you go:\n${JSON.stringify(sixReviews)}`),
    });

    const result = await getMovieReviews(sampleInput);
    expect(result).toEqual(sixReviews);
  });

  it('falls back when response is not ok', async () => {
    // @ts-ignore
    global.fetch.mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });

    const result = await getMovieReviews(sampleInput);
    expect(result).toEqual(generateFallbackReviews());
  });

  it('falls back when fetch throws', async () => {
    // @ts-ignore
    global.fetch.mockRejectedValue(new Error('network failure'));

    const result = await getMovieReviews(sampleInput);
    expect(result).toEqual(generateFallbackReviews());
  });

  describe('raw AI output parsing', () => {

    it('returns array when text contains valid JSON and pads/truncates to six', async () => {
      const sampleJobs: Review[] = [
        { author: 'Alice', content: 'Great film!' },
        { author: 'Bob', content: 'Could be better.' },
        { author: 'Carol', content: 'Mediocre at best.' },
        { author: 'Dan', content: 'Absolutely loved it.' },
        { author: 'Eve', content: 'Not my cup of tea.' },
        { author: 'Frank', content: 'A must-watch for fans.' },
      ];

      // the chat response wraps the reviews array plus some extra text
      const payload = `Here you go:\n${JSON.stringify(sampleJobs)}`;

      // @ts-ignore
      global.fetch.mockResolvedValue({ ok: true, json: async () => makeChatResponse(payload) });

      const result = await getMovieReviews(sampleInput);
      expect(result).toEqual(sampleJobs);
    });

    it('pads when AI returns too few reviews', async () => {
      const partial: Review[] = [
        { author: 'Only One', content: 'Just a single review.' },
      ];
      const payload = JSON.stringify(partial);
      // @ts-ignore
      global.fetch.mockResolvedValue({ ok: true, json: async () => makeChatResponse(payload) });

      const result = await getMovieReviews(sampleInput);
      expect(result.length).toBe(6);
      expect(result[0]).toEqual(partial[0]);
      expect(result.slice(1).every(r => r.author.startsWith('Guest Critic'))).toBe(true);
    });

    it('truncates when AI returns more than six reviews', async () => {
      const many: Review[] = Array.from({ length: 10 }, (_, i) => ({
        author: `Critic${i+1}`,
        content: `Review ${i+1}`,
      }));
      const payload = JSON.stringify(many);
      // @ts-ignore
      global.fetch.mockResolvedValue({ ok: true, json: async () => makeChatResponse(payload) });

      const result = await getMovieReviews(sampleInput);
      expect(result.length).toBe(6);
      expect(result).toEqual(many.slice(0,6));
    });
  });
});
