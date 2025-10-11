import { useState } from 'react';
import { GraduationCap, User, Settings, LogOut, Bell, Search, BookOpen, Users, BarChart3, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
const Header = () => {
  const navigate = useNavigate()
  const {userDetails} = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const logout = async () => {
    const response = await fetch('https://edulearn-hn19.onrender.com/api/logout', {
      method: 'POST',
      credentials: 'include'
    });
    if(!response.ok) {
      console.log("Error logging out");
      return;
    }
    localStorage.removeItem('userDetails');
    navigate('/login')
  }
  const getNavItems = () => {
    switch(userDetails.role) {
      case 'admin':
        return [
          { label: 'Dashboard', icon: BarChart3, href: '/dashboard' },
          { label: 'Courses', icon: BookOpen, href: '/courses' },
        ];
      case 'instructor':
        return [
          { label: 'Dashboard', icon: BarChart3, href: '/dashboard' },
          { label: 'All Courses', icon: BookOpen, href: '/courses' },
        ];
      case 'student':
        return [
          { label: 'Dashboard', icon: BarChart3, href: '/dashboard' },
          { label: 'All Courses', icon: BookOpen, href: '/courses' },
        ];
      default:
        return [];
    }
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl"><GraduationCap className="w-8 h-8 text-white" /></div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{userDetails.organization ?? 'Edulearn'}</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Learning Management System</p>
              </div>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-6">
            {getNavItems().map((item) => {
              const IconComponent = item.icon;
              return (
                <a key={item.label} href={item.href} className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50">
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </a>
              );
            })}
          </nav>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button onMouseEnter={() => setIsProfileOpen(true)} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {userDetails.avatar}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">{userDetails.username}</p>
                  <p className="text-xs text-gray-500 uppercase">{userDetails.role}</p>
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50" onMouseEnter={() => setIsProfileOpen(true)} onMouseLeave={() => setIsProfileOpen(false)}>
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{userDetails.username}</p>
                    <p className="text-sm text-gray-500">{userDetails.email}</p>
                  </div>
                  <div className="border-t border-gray-200 mt-2">
                    <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50" onClick={logout}>
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600 hover:text-blue-600">
              {isMenuOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              {getNavItems().map((item) => {
                const IconComponent = item.icon;
                return (
                  <a key={item.label} href={item.href} className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </a>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;