'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Search templates...",
  className = ""
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`relative flex items-center transition-all duration-200 ${
        isFocused 
          ? 'ring-2 ring-blue-500 ring-opacity-50' 
          : 'ring-1 ring-gray-300'
      } rounded-lg bg-white shadow-sm`}>
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon 
            className={`h-5 w-5 transition-colors duration-200 ${
              isFocused ? 'text-blue-500' : 'text-gray-400'
            }`} 
          />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-3 border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 bg-transparent"
        />

        {/* Clear Button */}
        {value && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
              type="button"
            >
              <XMarkIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        )}
      </div>

      {/* Search Suggestions (Optional Enhancement) */}
      {isFocused && value && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
              Quick Searches
            </div>
            {[
              'Authentication templates',
              'Payment processing',
              'Email notifications',
              'Image processing',
              'Database utilities'
            ].filter(suggestion => 
              suggestion.toLowerCase().includes(value.toLowerCase())
            ).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onChange(suggestion)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-150"
              >
                <div className="flex items-center">
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 mr-2" />
                  {suggestion}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}