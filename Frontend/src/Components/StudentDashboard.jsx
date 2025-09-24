import React, { useState } from 'react';
import { BookOpen,   Users,  Clock,  Award} from 'lucide-react';
import StatCard from './StarCard';
import CourseCard from './CourseCard';
// import Header from './Header';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import EmptyView from './EmptyView';
const StudentDashboard = () => {
  const {userDetails} = useAuth();
  const [studentStats, setStudentStats] = useState({
    totalCourses: 5,
    totalStudents: 128,
  });

  const [myCourses, setMyCourses] = useState([]);
  
  const fetchMyCourses = async () => {
    try {
      const response = await fetch(`https://edulearn-hn19.onrender.com/courses/student/${userDetails.id}`,{
        credentials:'include',
      });
      const data = await response.json();
      setMyCourses(data.details);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }
  const fetchStudentStats = async () => {
    try {
      const response = await fetch(`https://edulearn-hn19.onrender.com/stats/student/${userDetails.id}`,{
        credentials:'include',
      });
      const data = await response.json();
      setStudentStats(data.details);
    } catch (error) {
      console.error("Error fetching student stats:", error);
    }
  }

 useEffect(() => {
    fetchMyCourses();
    fetchStudentStats();
 },[])

  if (!studentStats || myCourses.length === 0) {
    return <EmptyView />;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
                <p className="text-gray-600 mt-1">View your enrolled courses and track your progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={BookOpen} title="Enrolled Courses" value={studentStats.totalCourses} color="bg-blue-500" />     
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> 
          {/* My Courses */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Enrolled Courses</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;