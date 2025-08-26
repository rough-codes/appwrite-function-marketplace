'use client';

import { useState, useEffect } from 'react';
import { databases, account } from '@/lib/appwrite';
import { TemplateCard } from '@/components/TemplateCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { SearchBar } from '@/components/SearchBar';
import { FeaturedSection } from '@/components/FeaturedSection';

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
}

export default function HomePage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [featuredTemplates, setFeaturedTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadInitialData();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error) {
      // User not logged in
      setUser(null);
    }
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Load featured templates
      const featuredResponse = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        'templates',
        [
          { method: 'equal', attribute: 'is_featured', values: [true] },
          { method: 'orderDesc', attribute: 'rating_average' },
          { method: 'limit', values: [6] }
        ]
      );
      setFeaturedTemplates(featuredResponse.documents as Template[]);

      // Load all templates
      const templatesResponse = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        'templates',
        [
          { method: 'orderDesc', attribute: 'download_count' },
          { method: 'limit', values: [50] }
        ]
      );
      setTemplates(templatesResponse.documents as Template[]);

      // Extract unique categories
      const uniqueCategories = [...new Set(
        templatesResponse.documents.map((template: Template) => template.category)
      )];
      setCategories(uniqueCategories);

    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className=\"min-h-screen bg-gray-50 flex items-center justify-center\">
        <div className=\"text-center\">
          <div className=\"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4\"></div>
          <p className=\"text-gray-600\">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className=\"min-h-screen bg-gray-50\">
      {/* Header */}
      <header className=\"bg-white shadow-sm border-b\">
        <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
          <div className=\"flex justify-between items-center h-16\">
            <div className=\"flex items-center space-x-4\">
              <h1 className=\"text-2xl font-bold text-gray-900\">
                Appwrite Function Marketplace
              </h1>
              <span className=\"bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full\">
                Beta
              </span>
            </div>
            
            <div className=\"flex items-center space-x-4\">
              {user ? (
                <div className=\"flex items-center space-x-3\">
                  <span className=\"text-sm text-gray-700\">Welcome, {user.name}</span>
                  <button className=\"bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700\">
                    Upload Template
                  </button>
                </div>
              ) : (
                <button className=\"bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700\">
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className=\"bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16\">
        <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center\">
          <h2 className=\"text-4xl font-bold mb-4\">
            Deploy Appwrite Functions in Seconds
          </h2>
          <p className=\"text-xl mb-8 text-blue-100\">
            Discover, customize, and deploy pre-built function templates to accelerate your development
          </p>
          <div className=\"max-w-2xl mx-auto\">
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder=\"Search templates, categories, or tags...\"
            />
          </div>
        </div>
      </section>

      {/* Featured Templates */}
      {featuredTemplates.length > 0 && (
        <FeaturedSection templates={featuredTemplates} />
      )}

      {/* Main Content */}
      <main className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8\">
        <div className=\"flex flex-col lg:flex-row gap-8\">
          {/* Sidebar */}
          <aside className=\"lg:w-64 flex-shrink-0\">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </aside>

          {/* Templates Grid */}
          <div className=\"flex-1\">
            <div className=\"flex justify-between items-center mb-6\">
              <h3 className=\"text-lg font-semibold text-gray-900\">
                {selectedCategory === 'all' ? 'All Templates' : `${selectedCategory} Templates`}
                <span className=\"text-gray-500 ml-2\">({filteredTemplates.length})</span>
              </h3>
              
              <select className=\"border border-gray-300 rounded-lg px-3 py-2 text-sm\">
                <option value=\"popular\">Most Popular</option>
                <option value=\"recent\">Recently Added</option>
                <option value=\"rating\">Highest Rated</option>
              </select>
            </div>

            {filteredTemplates.length === 0 ? (
              <div className=\"text-center py-12\">
                <p className=\"text-gray-500 text-lg\">No templates found matching your criteria.</p>
                <p className=\"text-gray-400 mt-2\">Try adjusting your search or category filter.</p>
              </div>
            ) : (
              <div className=\"grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6\">
                {filteredTemplates.map((template) => (
                  <TemplateCard key={template.$id} template={template} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}