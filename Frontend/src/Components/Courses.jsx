import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, Search,  Users,  Clock,  Edit,  Trash2,  Eye,  FileText, Star } from 'lucide-react';
import Header from './Header';
import CourseCard from './CourseCard';
import CreateCourseForm from './AddCourseForm';
import { useAuth } from '../context/AuthContext';
const Courses = () => {
  const {userDetails} = useAuth()
  const [searchTerm, setSearchTerm] = useState('');

  
  const [coursesData, setCoursesData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
    const fetchCourses = async () => {
    try {
      const response = await fetch("https://edulearn-hn19.onrender.com/courses",{credentials:'include',});
      const data = await response.json();
      setCoursesData(data.details);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  const handleSave = async(courseData) => {
    console.log('Course created:', courseData);
    const response = await fetch("https://edulearn-hn19.onrender.com/courses", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials:'include',
      body: JSON.stringify(courseData),
    });
    if(!response.ok) {
      console.log("Error creating course");
      return;
    }
    const data = await response.json();
    console.log(data);
    fetchCourses();
  };

  useEffect(() => {
    fetchCourses();
  }, []);
  const filterCourses = () => {
    let filtered = coursesData;
        
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

if(!coursesData) {
    return <div>Loading...</div>;
  }
  const filteredCourses = filterCourses();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
                <p className="text-gray-600 mt-1">Manage and create courses for your students</p>
              </div>
              {userDetails.role == 'admin' && (
                <button onClick={() => setIsOpen(!isOpen)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-all flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Course
                </button>
              )}
              <CreateCourseForm
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSave={handleSave}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses, instructors, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            
           
          </div>
        </div>

        {/* Courses Content */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first course'}
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors flex items-center mx-auto">
              <Plus className="w-4 h-4 mr-2" />
              Create Course
            </button>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Showing {filteredCourses.length} of {coursesData.length} courses
              </p>
            </div>             
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Courses;