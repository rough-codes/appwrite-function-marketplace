'use client';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: CategoryFilterProps) {
  const getCategoryIcon = (category: string) => {
    const icons = {
      'Authentication': '🔐',
      'Payments': '💳',
      'Notifications': '🔔',
      'Storage': '📁',
      'Analytics': '📊',
      'Utilities': '🛠️',
      'Email': '📧',
      'Database': '🗄️',
      'API': '🔌',
      'Security': '🛡️',
    };
    return icons[category as keyof typeof icons] || '📦';
  };

  const allCategories = ['all', ...categories];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
        <p className="text-sm text-gray-600 mt-1">Filter templates by category</p>
      </div>
      
      <div className="p-4">
        <div className="space-y-1">
          {allCategories.map((category) => {
            const isSelected = selectedCategory === category;
            const categoryCount = category === 'all' 
              ? categories.length 
              : 1; // You might want to pass actual counts
            
            return (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">
                    {category === 'all' ? '📋' : getCategoryIcon(category)}
                  </span>
                  <span className="capitalize">
                    {category === 'all' ? 'All Templates' : category}
                  </span>
                </div>
                
                {/* Category count badge */}
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  isSelected
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {categoryCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Popular Tags Section */}
      <div className="p-4 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Popular Tags</h4>
        <div className="flex flex-wrap gap-2">
          {[
            'auth', 'email', 'payments', 'webhooks', 'notifications', 
            'stripe', 'firebase', 'smtp', 'jwt', 'oauth'
          ].map((tag) => (
            <button
              key={tag}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
        <div className="space-y-2">
          <button className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-200">
            <span className="mr-2">⭐</span>
            Featured Templates
          </button>
          
          <button className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors duration-200">
            <span className="mr-2">🆕</span>
            Recently Added
          </button>
          
          <button className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors duration-200">
            <span className="mr-2">🔥</span>
            Most Popular
          </button>
        </div>
      </div>
    </div>
  );
}