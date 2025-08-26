'use client';

import { TemplateCard } from './TemplateCard';

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

interface FeaturedSectionProps {
  templates: Template[];
}

export function FeaturedSection({ templates }: FeaturedSectionProps) {
  if (templates.length === 0) return null;

  return (
    <section className="bg-white py-12 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <span className="text-3xl mr-3">⭐</span>
            <h2 className="text-3xl font-bold text-gray-900">Featured Templates</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hand-picked, production-ready function templates trusted by thousands of developers
          </p>
        </div>

        {/* Featured Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {templates.reduce((sum, t) => sum + t.download_count, 0).toLocaleString()}
            </div>
            <div className="text-sm text-blue-700 font-medium">Total Downloads</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {(templates.reduce((sum, t) => sum + t.rating_average, 0) / templates.length).toFixed(1)}
            </div>
            <div className="text-sm text-green-700 font-medium">Average Rating</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-100">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {templates.length}
            </div>
            <div className="text-sm text-purple-700 font-medium">Featured Templates</div>
          </div>
        </div>

        {/* Featured Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.$id} className="relative">
              {/* Featured Badge */}
              <div className="absolute -top-2 -right-2 z-10">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  ⭐ FEATURED
                </div>
              </div>
              
              <TemplateCard template={template} />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-10">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
            <h3 className="text-xl font-bold mb-2">Want your template featured?</h3>
            <p className="text-blue-100 mb-4">
              Submit high-quality, well-documented templates and get featured in our marketplace
            </p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200">
              Submit Template
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}