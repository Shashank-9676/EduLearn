import React from 'react';
import { Home, Search, BookOpen, ArrowLeft,HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router';

const NotFound = () => {
    const navigate = useNavigate();
  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };


  const popularLinks = [
    // { label: 'Home', icon: Home, path: '/' },
    { label: 'Browse Courses', icon: BookOpen, path: '/courses' },
    { label: 'About Us', icon: HelpCircle, path: '/about' },
    { label: 'Contact', icon: Search, path: '/contact' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            {/* Large 404 Text */}
            <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              404
            </h1>
            
            {/* Floating Elements */}
            <div className="absolute top-0 left-1/4 w-12 h-12 bg-blue-200 rounded-full opacity-60 animate-bounce"></div>
            <div className="absolute bottom-0 right-1/4 w-8 h-8 bg-purple-200 rounded-full opacity-60 animate-bounce animation-delay-300"></div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            The page you're looking for seems to have wandered off.
          </p>
          <p className="text-gray-500">
            It might have been moved, deleted, or never existed in the first place.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={handleGoHome}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-8 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Homepage
          </button>
          
          <button
            onClick={handleGoBack}
            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-3 px-8 rounded-lg font-semibold transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Popular Links */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Try these popular links instead:
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {popularLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => navigate(link.path)}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-blue-50 transition-colors group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                  <link.icon className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                  {link.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            Still can't find what you're looking for?{' '}
            <a href="/contact" className="text-blue-600 hover:text-blue-700 underline">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;