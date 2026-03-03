'use client';

import { useState, useEffect, useRef } from 'react';
import MovieResult from '@/components/MovieResult';
import LoadingOrb from '@/components/LoadingOrb';
import MovieShowcase from '@/components/MovieShowcase';
import ParticleField from '@/components/ParticleField';
import { validateImdbId } from '@/lib/validators';
import type { MovieData } from '@/lib/types';

export default function Home() {
  const [imdbId, setImdbId] = useState('');
  const [loading, setLoading] = useState(false);
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [error, setError] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto focus after mount
    setTimeout(() => inputRef.current?.focus(), 800);
  }, []);

  const handleSearch = async () => {
    setError('');
    const cleanId = imdbId.trim();
    
    if (!cleanId) {
      setError('Please enter an IMDb movie ID');
      return;
    }
    
    if (!validateImdbId(cleanId)) {
      setError('Invalid IMDb ID. Format should be like: tt0133093');
      return;
    }

    setLoading(true);
    setMovieData(null);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/movie?id=${cleanId}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch movie data');

      setMovieData(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleSelectMovie = async (id: string, title: string) => {
    setImdbId(id);
    setError('');
    setMovieData(null);
    setHasSearched(true);
    setLoading(true);

    try {
      const res = await fetch(`/api/movie?id=${id}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch movie data');

      setMovieData(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMovieData(null);
    setError('');
    setHasSearched(false);
    setImdbId('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 bg-black">
        {/* Gradient blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gray-600/20 rounded-full blur-[120px] blob" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-gray-600/15 rounded-full blur-[100px] blob" style={{ animationDelay: '-4s' }} />
        <div className="absolute bottom-[-20%] left-[20%] w-[700px] h-[700px] bg-gray-900/20 rounded-full blur-[130px] blob" style={{ animationDelay: '-2s' }} />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Particle field */}
      <ParticleField />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Hero section */}
        <div className={`transition-all duration-700 ease-in-out ${hasSearched && movieData ? 'pt-6 pb-4' : 'pt-16 pb-8 md:pt-28 md:pb-12'}`}>
          <div className="container mx-auto px-4 max-w-4xl text-center">
            
            {/* Logo badge */}
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 text-sm text-gray-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
              AI-Powered Movie Intelligence
            </div>

            {/* Main heading */}
            <h1 className={`font-black tracking-tight leading-none transition-all duration-500 ${hasSearched && movieData ? 'text-3xl md:text-4xl mb-2' : 'text-5xl md:text-7xl mb-4'}`}>
              <span className="gradient-text">Cine</span>
              <span className="text-white">Insight</span>
            </h1>

            {!hasSearched || !movieData ? (
              <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                Enter any IMDb movie ID and unlock{' '}
                <span className="text-gray-300 font-medium">deep AI analysis</span>,
                audience sentiment, and cinematic intelligence.
              </p>
            ) : null}

            {/* Search bar */}
            <div className="max-w-xl mx-auto">
              <div className={`relative transition-all duration-300 ${inputFocused ? 'scale-[1.02]' : 'scale-100'}`}>
                {/* Glow border */}
                <div className={`absolute -inset-[1px] rounded-2xl transition-opacity duration-300 ${inputFocused ? 'opacity-100' : 'opacity-40'}`}
                  style={{ background: 'linear-gradient(135deg, #444444, #666666, #888888)', borderRadius: '16px' }}
                />
                
                <div className="relative flex items-center glass-dark rounded-2xl overflow-hidden">
                  {/* Movie icon */}
                  <div className="pl-5 pr-2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                  
                  <input
                    ref={inputRef}
                    type="text"
                    value={imdbId}
                    onChange={e => setImdbId(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    placeholder="tt0133093"
                    className="flex-1 bg-transparent py-4 px-3 text-white placeholder-gray-500 text-base focus:outline-none font-mono"
                  />
                  
                  {/* Search button */}
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="m-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                    style={{ background: 'linear-gradient(135deg, #555555, #777777)' }}
                  >
                    <span className="relative z-10">{loading ? 'Analyzing...' : 'Analyze'}</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </button>
                </div>
              </div>

              {/* Example IDs */}
              {!hasSearched && (
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <span className="text-gray-500 text-sm">Try:</span>
                  {['tt0133093', 'tt0068646', 'tt0111161', 'tt0816692'].map(id => (
                    <button
                      key={id}
                      onClick={() => setImdbId(id)}
                      className="text-sm text-gray-400 hover:text-gray-300 font-mono glass rounded-lg px-3 py-1 transition-all hover:scale-105"
                    >
                      {id}
                    </button>
                  ))}
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="mt-4 flex items-center gap-2 glass rounded-xl px-4 py-3 border border-red-500/30 bg-red-500/10">
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && <LoadingOrb />}

        {/* Results */}
        {movieData && !loading && (
          <div className="container mx-auto px-4 max-w-6xl pb-16">
            <MovieResult data={movieData} onReset={handleReset} />
          </div>
        )}

        {/* Movie Showcase - only on landing */}
        {!hasSearched && (
          <MovieShowcase onSelectMovie={handleSelectMovie} />
        )}

        {/* Features grid - only show on landing */}
        {!hasSearched && (
          <div className="container mx-auto px-4 max-w-5xl mt-8 pb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
              {[
                {
                  icon: '🎬',
                  title: 'Movie Details',
                  desc: 'Poster, cast, rating, and plot — all in one place',
                  color: 'from-gray-500/20 to-gray-700/20',
                  border: 'border-gray-500/20',
                },
                {
                  icon: '🧠',
                  title: 'AI Sentiment',
                  desc: 'Claude AI analyzes real audience reviews for deep insights',
                  color: 'from-gray-600/20 to-gray-500/20',
                  border: 'border-violet-500/20',
                },
                {
                  icon: '�📊',
                  title: 'Audience Intelligence',
                  desc: 'Positive, mixed, or negative — understand the crowd',
                  color: 'from-indigo-500/20 to-blue-500/20',
                  border: 'border-indigo-500/20',
                },
                {
                  icon: '�',
                  title: 'User Reviews',
                  desc: 'Read real viewer comments fetched live with graceful fallbacks',
                  color: 'from-green-500/20 to-teal-500/20',
                  border: 'border-green-500/20',
                },
                
              ].map((feat, i) => (
                <div key={i} className={`card-lift glass rounded-2xl p-6 border ${feat.border} bg-gradient-to-br ${feat.color}`} style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="text-3xl mb-3">{feat.icon}</div>
                  <h3 className="font-semibold text-white mb-1">{feat.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
