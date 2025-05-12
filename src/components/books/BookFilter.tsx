import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';

interface FilterOptions {
  condition: string[];
  category: string[];
  minPrice: number;
  maxPrice: number;
}

interface BookFilterProps {
  categories: string[];
  onFilter: (filters: FilterOptions) => void;
  showCondition?: boolean;
}

const BookFilter: React.FC<BookFilterProps> = ({ categories, onFilter, showCondition = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    condition: [],
    category: [],
    minPrice: 0,
    maxPrice: 100
  });

  const conditions = ['New', 'Like New', 'Good', 'Acceptable'];

  const handleConditionChange = (condition: string) => {
    setFilters(prev => {
      if (prev.condition.includes(condition)) {
        return {
          ...prev,
          condition: prev.condition.filter(c => c !== condition)
        };
      } else {
        return {
          ...prev,
          condition: [...prev.condition, condition]
        };
      }
    });
  };

  const handleCategoryChange = (category: string) => {
    setFilters(prev => {
      if (prev.category.includes(category)) {
        return {
          ...prev,
          category: prev.category.filter(c => c !== category)
        };
      } else {
        return {
          ...prev,
          category: [...prev.category, category]
        };
      }
    });
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) return;
    
    setFilters(prev => ({
      ...prev,
      [type === 'min' ? 'minPrice' : 'maxPrice']: numValue
    }));
  };

  const applyFilters = () => {
    onFilter(filters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      condition: [],
      category: [],
      minPrice: 0,
      maxPrice: 100
    });
    onFilter({
      condition: [],
      category: [],
      minPrice: 0,
      maxPrice: 100
    });
  };

  return (
    <div className="relative mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors duration-300"
      >
        <Filter className="h-5 w-5 mr-2" />
        Filter Books
      </button>
      
      {isOpen && (
        <div className="absolute left-0 mt-2 w-full md:w-80 bg-white rounded-md shadow-lg z-10 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-amber-900">Filter Books</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Condition Filter */}
          {showCondition && (
            <div className="mb-4">
              <h4 className="font-medium text-amber-800 mb-2">Condition</h4>
              <div className="space-y-2">
                {conditions.map(condition => (
                  <label key={condition} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.condition.includes(condition)}
                      onChange={() => handleConditionChange(condition)}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">{condition}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          
          {/* Category Filter */}
          <div className="mb-4">
            <h4 className="font-medium text-amber-800 mb-2">Category</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {categories.map(category => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.category.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Price Range */}
          <div className="mb-4">
            <h4 className="font-medium text-amber-800 mb-2">Price Range</h4>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                value={filters.minPrice}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className="w-1/3 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="Min"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                min="0"
                value={filters.maxPrice}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="w-1/3 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="Max"
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={resetFilters}
              className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors duration-300"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="px-3 py-1 bg-amber-700 text-white rounded hover:bg-amber-800 transition-colors duration-300"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookFilter;