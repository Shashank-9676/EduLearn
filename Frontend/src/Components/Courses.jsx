import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, Search } from 'lucide-react';
import Header from './Header';
import CourseCard from './CourseCard';
import CreateCourseForm from './AddCourseForm';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import SyncLoader from 'react-spinners/SyncLoader';
import FailureView from './FailureView';
const api = import.meta.env.VITE_API_URL;
const Courses = () => {
  const {userDetails} = useAuth()
  const [searchTerm, setSearchTerm] = useState('');
  const [coursesData, setCoursesData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
    const fetchCourses = async () => {
    try 
    {
      setLoading(true);
      const url = userDetails ? `${api}/courses` : `${api}/courses/organization-courses`;
      const response = await fetch(url,{credentials:'include',});
      
      const data = await response.json();
      setCoursesData(data.details);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  const handleSave = async(courseData) => {
    const response = await fetch(`${api}/courses`, {
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
    toast.success(data.message || "Course created successfully!")
    fetchCourses();
  };

  useEffect(() => {
    fetchCourses();
  }, [userDetails]); // Reload when auth state changes

  /* 
    FilteredCourses structure depends on userDetails:
    - Logged In: Array of Course Objects
    - Not Logged In: Array of Organization Objects { organization_id, organization_name, courses: [] }
  */
  const filterCourses = () => {
    if (!coursesData) return [];
    
    // Check if it's the flat list (has 'title' property directly) or the grouped list (has 'courses' property)
    // We can check the first item to decide the type, or based on userDetails.
    const isFlatList = userDetails; // Simple proxy, but checking data is safer. 
    // Actually, userDetails might be null but data empty.
    
    if (userDetails) {
        // Flat list behavior
        if (!Array.isArray(coursesData)) return [];
        let filtered = coursesData;
        if (searchTerm) {
          filtered = filtered.filter(course =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (course.instructor && course.instructor.toLowerCase().includes(searchTerm.toLowerCase())) ||
            course.category.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        return filtered;
    } else {
        // Grouped list behavior (Array of Orgs)
        if (!Array.isArray(coursesData)) return [];
        
        // Return a new array where each org's courses are filtered
        return coursesData.map(org => {
           const filteredOrgCourses = org.courses.filter(course => 
              course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              course.category.toLowerCase().includes(searchTerm.toLowerCase())
           );
           return {
             ...org,
             courses: filteredOrgCourses
           };
        }).filter(org => org.courses.length > 0); // Remove orgs with no matching courses
    }
  };

if(loading){
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <SyncLoader color="#333333" size={15} />
      </div>
    );
}

// Check for empty data
const isDataEmpty = coursesData.length === 0;

if(!coursesData) {
    return <FailureView />;
  }
  const filteredCourses = filterCourses();
  const isFilteredEmpty = filteredCourses.length === 0;
  
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
              {userDetails?.role == 'admin' && (
                <button onClick={() => setIsOpen(!isOpen)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-all flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Course
                </button>
              )}
              <CreateCourseForm isOpen={isOpen} onClose={() => setIsOpen(false)} onSave={handleSave}/>
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
              <input type="text" placeholder="Search courses, categories..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
            </div>
          </div>
        </div>

        {/* Courses Content */}
        {isFilteredEmpty ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first course'}
            </p>
            {userDetails?.role == 'admin' && <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors flex items-center mx-auto" onClick={() => setIsOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Course
            </button>}
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
               {/* Simplified count for now */}
               {userDetails ? 
                `Showing ${filteredCourses.length} courses` : 
                `Showing courses across ${filteredCourses.length} organizations`
               }
              </p>
            </div>             
             
              {userDetails ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                 </div>
              ) : (
                <div className="space-y-8">
                    {filteredCourses.map((org) => (
                        <div key={org.organization_id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">{org.organization_name}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {org.courses.map((course) => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
};

export default Courses;