import React, { useState } from 'react';
import { BookOpen,   Users,  Clock,  Award} from 'lucide-react';
import StatCard from './StarCard';
import CourseCard from './CourseCard';
// import Header from './Header';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
const InstructorDashboard = () => {
  const {userDetails} = useAuth();
  const [instructorStats, setInstructorStats] = useState({
    totalCourses: 5,
    totalStudents: 128,
  });

  const [myCourses, setMyCourses] = useState([]);
  
  const fetchMyCourses = async () => {
    try {
      const response = await fetch(`http://localhost:3000/courses/instructor/${userDetails.id}`);
      const data = await response.json();
      setMyCourses(data.details);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }
  const fetchInstructorStats = async () => {
    try {
      const response = await fetch(`http://localhost:3000/stats/instructor/${userDetails.id}`);
      const data = await response.json();
      setInstructorStats(data.details);
    } catch (error) {
      console.error("Error fetching instructor stats:", error);
    }
  }

 useEffect(() => {
    fetchMyCourses();
    fetchInstructorStats();
 },[])

  if (!instructorStats || myCourses.length === 0) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
                <p className="text-gray-600 mt-1">View your assigned courses and track student progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={BookOpen} title="Assigned Courses" value={instructorStats.totalCourses} color="bg-blue-500" />     
          <StatCard icon={Users} title="Total Students" value={instructorStats.totalStudents} color="bg-green-500" />
          {/* <StatCard
            icon={Clock}
            title="Active Courses"
            value={instructorStats.activeCourses}
            color="bg-purple-500"
          />
          <StatCard
            icon={Award}
            title="Completed Courses"
            value={instructorStats.completedCourses}
            color="bg-orange-500"
          /> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> 
          {/* My Courses */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Assigned Courses</h2>
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

export default InstructorDashboard;