'use client';

import { useState } from 'react';
import { StarIcon, DownloadIcon, CodeBracketIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface Template {
  $id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  runtime: string;
  author_id: string;
  download_count: number;
  rating_average: number;
  rating_count: number;
  is_featured: boolean;
  is_verified: boolean;
}

interface TemplateCardProps {
  template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <StarOutlineIcon className="h-4 w-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <StarIcon className="h-4 w-4 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <StarOutlineIcon key={i} className="h-4 w-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Authentication': 'bg-blue-100 text-blue-800',
      'Payments': 'bg-green-100 text-green-800',
      'Notifications': 'bg-purple-100 text-purple-800',
      'Storage': 'bg-orange-100 text-orange-800',
      'Analytics': 'bg-pink-100 text-pink-800',
      'Utilities': 'bg-gray-100 text-gray-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRuntimeIcon = (runtime: string) => {
    if (runtime.includes('node')) return '🟢';
    if (runtime.includes('python')) return '🐍';
    if (runtime.includes('php')) return '🐘';
    if (runtime.includes('ruby')) return '💎';
    return '⚡';
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
        isHovered ? 'transform -translate-y-1' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {template.title}
            </h3>
            {template.is_verified && (
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            {template.is_featured && (
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                Featured
              </span>
            )}
          </div>
          
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
            {template.category}
          </span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {template.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {template.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
            >
              {tag}
            </span>
          ))}
          {template.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-500">
              +{template.tags.length - 3}
            </span>
          )}
        </div>

        {/* Runtime and Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <span>{getRuntimeIcon(template.runtime)}</span>
            <span>{template.runtime}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <DownloadIcon className="h-4 w-4" />
              <span>{template.download_count.toLocaleString()}</span>
            </div>
            
            {template.rating_count > 0 && (
              <div className="flex items-center space-x-1">
                <div className="flex items-center">
                  {renderStars(template.rating_average)}
                </div>
                <span>({template.rating_count})</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {template.author_id.charAt(0).toUpperCase()}
            </div>
            <span>by {template.author_id}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <CodeBracketIcon className="h-4 w-4 mr-1" />
              View Code
            </button>
            
            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              Deploy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}