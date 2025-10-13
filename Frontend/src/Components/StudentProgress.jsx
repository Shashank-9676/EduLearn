import React, { useState, useEffect } from 'react';
import {  Users,   Search,   BookOpen,  CheckCircle,  Clock,  TrendingUp,User,  Mail,  Eye,  Award} from 'lucide-react';
import {useParams} from 'react-router'
import StatCard from './StarCard';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Header from './Header'
import FailureView from './FailureView';
import StudentProgressCard from './StudentProgressCard';
const StudentProgress = () => {
  const {id } = useParams()
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const {userDetails} = useAuth()

  useEffect(() => {
    const fetchCourseProgress = async () => {
      try {
        setLoading(true);
      const response = await fetch(`https://edulearn-hn19.onrender.com/progress/course/${id}/user/${userDetails.id}`,{credentials:'include',})
        const data = await response.json();
        if (response.ok) {
          setStudents(data.users);
        } else {
          toast.error('Failed to fetch course progress');
        }
        setLoading(false);
        
      } catch (err) {
        setError('Error loading course data');
        console.log(err)
      }
    };

    fetchCourseProgress();
  }, [id]);
  
    const filteredStudents = students?.filter(student => 
    student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalStudents: students.length,
    completedStudents: students.filter(s => s.percent === 100).length,
    averageProgress: students.length > 0 ? Math.round(students.reduce((acc, s) => acc + s.percent, 0) / students.length) : 0,
    activeStudents: students.filter(s => s.percent > 0 && s.percent < 100).length
  };

  


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <FailureView />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Course Progress</h1>
              <p className="text-gray-600 mt-1">Track student progress and engagement</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Users} title="Total Students" value={stats.totalStudents} color="bg-blue-500"/>
          <StatCard icon={TrendingUp} title="Active Students" value={stats.activeStudents} color="bg-green-500" />
          <StatCard icon={CheckCircle} title="Completed" value={stats.completedStudents} color="bg-purple-500"/>
          <StatCard icon={Award} title="Average Progress" value={`${stats.averageProgress}%`} color="bg-orange-500"/>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Search students by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {/* Students Progress */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Student Progress</h2>
              <span className="text-sm text-gray-500">Showing {filteredStudents.length} of {stats.totalStudents} students</span>
            </div>
          </div>
          <div className="p-6">
            {filteredStudents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student) => (
                  <StudentProgressCard key={student.user_id} student={student} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{searchTerm ? 'No students found' : 'No students enrolled'}</h3>
                <p className="text-gray-500">{searchTerm ? 'Try adjusting your search terms' : 'Students will appear here once they enroll in the course'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;