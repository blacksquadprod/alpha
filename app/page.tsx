'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Define the type for an Arabic letter
interface ArabicLetter {
  name: string;
  arabic: string;
  solarLunar: 'Solar' | 'Lunar';
  articulationPoint: string;
  phoneticTranscription: string;
  audioUrl: string;
}

// Arabic letters data
const arabicLetters: ArabicLetter[] = [
  {
    name: 'Alif',
    arabic: 'ا',
    solarLunar: 'Lunar',
    articulationPoint: 'Throat (Glottal)',
    phoneticTranscription: '/ʔ/',
    audioUrl: '/audio/alif.mp3',
  },
  {
    name: 'Bâ',
    arabic: 'ب',
    solarLunar: 'Lunar',
    articulationPoint: 'Lips (Bilabial)',
    phoneticTranscription: '/b/',
    audioUrl: '/audio/ba.mp3',
  },
  // Add more letters here...
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<ArabicLetter | null>(null);
  const [isValidated, setIsValidated] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference for dark mode
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  const filteredLetters = arabicLetters.filter(letter =>
    letter.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLetterSelect = (letter: ArabicLetter) => {
    setSelectedLetter(letter);
    setIsValidated(false);
    setAudioError(null);
  };

  const handleValidate = () => {
    if (selectedLetter) {
      setIsValidated(true);
    }
  };

  const playAudio = async (audioUrl: string) => {
    try {
      setIsPlaying(true);
      setAudioError(null);
      const audio = new Audio(audioUrl);
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
      });

      audio.addEventListener('error', () => {
        setIsPlaying(false);
        setAudioError('Could not play the audio. Please try again.');
      });

      await audio.play();
    } catch (error) {
      setIsPlaying(false);
      setAudioError('Could not play the audio. Please try again.');
      console.error('Error playing audio:', error);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <nav className="border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold">Arabic Alphabet</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-opacity-20 hover:bg-opacity-30 transition-colors"
            >
              {darkMode ? '🌞' : '🌙'}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-8">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-center mb-2">Learn Arabic Letters</h2>
          <p className="text-center text-gray-600 dark:text-gray-400">Explore the beauty of Arabic alphabet</p>
        </div>
        
        {/* Search Section */}
        <div className="mb-8 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a letter..."
              className={`w-full p-4 pl-12 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors
                ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {searchTerm && (
            <div className={`mt-2 rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {filteredLetters.map((letter) => (
                <button
                  key={letter.name}
                  className={`w-full p-4 text-left hover:bg-opacity-10 transition-colors flex items-center justify-between
                    ${darkMode ? 'hover:bg-white' : 'hover:bg-gray-100'}`}
                  onClick={() => handleLetterSelect(letter)}
                >
                  <span>{letter.name}</span>
                  <span className="text-2xl font-arabic">{letter.arabic}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Letter Display */}
        <div className={`rounded-xl shadow-lg p-8 transition-colors ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {!selectedLetter ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Search for a letter using the search bar above
              </p>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">
                  {isValidated ? `Selected letter: ${selectedLetter.name}` : 'Confirm your selection'}
                </h2>
                {!isValidated && (
                  <button
                    onClick={handleValidate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md transition-colors"
                  >
                    Confirm Selection
                  </button>
                )}
              </div>

              {isValidated && (
                <div className="space-y-8">
                  <div className="text-center mb-12">
                    <span className="text-9xl font-arabic block mb-4">{selectedLetter.arabic}</span>
                    <div className="h-1 w-24 mx-auto bg-blue-600 rounded-full"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h3 className="font-semibold text-lg mb-3">Classification</h3>
                      <p className="text-xl">{selectedLetter.solarLunar} Letter</p>
                    </div>
                    
                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h3 className="font-semibold text-lg mb-3">Articulation Point</h3>
                      <p className="text-xl">{selectedLetter.articulationPoint}</p>
                    </div>
                    
                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h3 className="font-semibold text-lg mb-3">Phonetic Transcription</h3>
                      <p className="text-xl font-mono">{selectedLetter.phoneticTranscription}</p>
                    </div>
                    
                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h3 className="font-semibold text-lg mb-3">Pronunciation</h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => playAudio(selectedLetter.audioUrl)}
                          disabled={isPlaying}
                          className={`flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl transition-all transform hover:scale-105
                            ${isPlaying 
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-green-600 hover:bg-green-700'} text-white shadow-md`}
                        >
                          {isPlaying ? (
                            <span className="animate-pulse flex items-center gap-2">
                              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                              </svg>
                              Playing...
                            </span>
                          ) : (
                            <>
                              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                              </svg>
                              Listen to Pronunciation
                            </>
                          )}
                        </button>
                        {audioError && (
                          <p className="text-red-500 text-sm text-center bg-red-100 dark:bg-red-900 p-2 rounded-lg">
                            {audioError}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
