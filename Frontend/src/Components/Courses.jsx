import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, Search,  Users,  Clock,  Edit,  Trash2,  Eye,  FileText, Star } from 'lucide-react';
import Header from './Header';
import CourseCard from './CourseCard';
import CreateCourseForm from './AddCourseForm';
import { useAuth } from '../context/AuthContext';
const Courses = () => {
  const {userDetails} = useAuth()
  const [searchTerm, setSearchTerm] = useState('');

  
  const [coursesData, setCoursesData] = useState([
    {
      id: 1,
      title: 'React Development Fundamentals',
      description: 'Learn the basics of React.js and build dynamic web applications',
      instructor: 'John Doe',
      category: 'Web Development',
      students: 45,
      lessons: 12,
      duration: '8 weeks',
      level: 'Beginner',
      status: 'Active',
      rating: 4.8,
      thumbnail: 'https://via.placeholder.com/300x200?text=React+Course',
      createdDate: '2025-01-10',
      price: 'Free'
    },
    {
      id: 2,
      title: 'Advanced JavaScript Concepts',
      description: 'Master advanced JavaScript concepts including closures, promises, and async/await',
      instructor: 'Jane Smith',
      category: 'Programming',
      students: 32,
      lessons: 16,
      duration: '10 weeks',
      level: 'Advanced',
      status: 'Active',
      rating: 4.9,
      thumbnail: 'https://via.placeholder.com/300x200?text=JavaScript+Course',
      createdDate: '2025-01-08',
      price: '$99'
    },
    {
      id: 3,
      title: 'UI/UX Design Principles',
      description: 'Learn design thinking, user research, and create beautiful user interfaces',
      instructor: 'Mike Johnson',
      category: 'Design',
      students: 28,
      lessons: 10,
      duration: '6 weeks',
      level: 'Intermediate',
      status: 'Draft',
      rating: 4.6,
      thumbnail: 'https://via.placeholder.com/300x200?text=UI%2FUX+Course',
      createdDate: '2025-01-05',
      price: '$149'
    },
    {
      id: 4,
      title: 'Database Management Systems',
      description: 'Comprehensive guide to SQL, database design, and optimization techniques',
      instructor: 'Sarah Davis',
      category: 'Database',
      students: 38,
      lessons: 14,
      duration: '12 weeks',
      level: 'Intermediate',
      status: 'Active',
      rating: 4.7,
      thumbnail: 'https://via.placeholder.com/300x200?text=Database+Course',
      createdDate: '2025-01-03',
      price: '$199'
    },
    {
      id: 5,
      title: 'Python for Data Science',
      description: 'Learn Python programming for data analysis, visualization, and machine learning',
      instructor: 'Alex Brown',
      category: 'Data Science',
      students: 52,
      lessons: 18,
      duration: '14 weeks',
      level: 'Beginner',
      status: 'Active',
      rating: 4.9,
      thumbnail: 'https://via.placeholder.com/300x200?text=Python+Course',
      createdDate: '2025-01-01',
      price: '$249'
    },
    {
      id: 6,
      title: 'Mobile App Development',
      description: 'Build cross-platform mobile applications using React Native',
      instructor: 'Emily Wilson',
      category: 'Mobile Development',
      students: 0,
      lessons: 0,
      duration: '8 weeks',
      level: 'Intermediate',
      status: 'Draft',
      rating: 0,
      thumbnail: 'https://via.placeholder.com/300x200?text=Mobile+Course',
      createdDate: '2024-12-28',
      price: '$179'
    }
  ]
);
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