import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Book } from '../types';
import { books } from '../data/mockData';

const SellBookPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    condition: 'Good',
    category: '',
    year: '',
    description: '',
  });
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (!selectedImage) {
      setError('Please upload a book image');
      return;
    }
    
    // Basic validation
    if (!formData.title || !formData.author || !formData.price || !formData.category || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Validate price
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      setError('Please enter a valid price');
      return;
    }
    
    // Validate year if provided
    const year = formData.year ? parseInt(formData.year) : undefined;
    if (year && (isNaN(year) || year < 1800 || year > new Date().getFullYear())) {
      setError(`Please enter a valid year between 1800 and ${new Date().getFullYear()}`);
      return;
    }
    
    setIsSubmitting(true);
    
    // Create new book
    const newBook: Book = {
      id: (books.length + 1).toString(),
      title: formData.title,
      author: formData.author,
      price,
      category: formData.category,
      stock: 1,
      imageUrl: selectedImage,
      condition: formData.condition as 'New' | 'Like New' | 'Good' | 'Acceptable',
      description: formData.description,
      year,
      sellerId: currentUser.id,
      status: 'pending'
    };
    
    // In a real app, we would make an API call to add the book
    // For this demo, we'll just add to our mock data
    books.push(newBook);
    
    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        title: '',
        author: '',
        price: '',
        condition: 'Good',
        category: '',
        year: '',
        description: '',
      });
      setSelectedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1000);
  };

  if (!currentUser) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-lg text-gray-600 mb-4">Please login to sell your books</p>
          <Link 
            to="/login" 
            className="px-6 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors duration-300"
          >
            Login
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-serif font-bold text-amber-900 mb-2">Sell Your Books</h1>
        <p className="text-gray-600 mb-6">List your used books for sale on Arcadia Reads marketplace</p>
        
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md">
            <p className="font-medium">Book submitted successfully!</p>
            <p>Your book has been submitted for review. Once approved, it will be listed on our marketplace.</p>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              {/* Book Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Book Image <span className="text-red-500">*</span>
                </label>
                <div
                  className="relative h-64 w-full border-2 border-dashed border-gray-300 rounded-lg overflow-hidden hover:border-amber-500 transition-colors duration-300"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Book preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center p-6 cursor-pointer">
                      <div className="text-amber-700 mb-2">
                        <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="text-amber-700">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Book Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="Enter the book title"
                  />
                </div>
                
                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                    Author <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="author"
                    name="author"
                    type="text"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="Enter the author's name"
                  />
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price (৳) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="Enter the price"
                  />
                </div>
                
                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                    Condition <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Acceptable">Acceptable</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="category"
                    name="category"
                    type="text"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="E.g., Fiction, Fantasy, Biography"
                  />
                </div>
                
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                    Publication Year
                  </label>
                  <input
                    id="year"
                    name="year"
                    type="text"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="Enter the publication year"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Book Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder="Provide a description of the book, including any notable features and its condition"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-4">
                <span className="text-red-500">*</span> Required fields
              </p>
              
              <div className="bg-amber-50 p-4 rounded-md mb-6">
                <h3 className="font-medium text-amber-800 mb-2">Listing Guidelines:</h3>
                <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                  <li>Provide accurate and detailed information about your book</li>
                  <li>Be honest about the condition of your book</li>
                  <li>Set a fair price based on the book's condition and market value</li>
                  <li>All listings are subject to approval by Arcadia Reads</li>
                </ul>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors duration-300 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Book for Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SellBookPage;