import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen,   Plus,  Play,  FileText, Users, CheckCircle,  Edit,  Trash2} from 'lucide-react';
import { Link, useParams } from 'react-router';
import LessonCard from './LessonCard';
// import ProgressExample from './ProgressCircle';
import AddLessonForm from './AddLessonForm';
import Header from './Header';
import { toast, ToastContainer } from 'react-toastify';
const CourseDetail = () => {
  const {userDetails} = useAuth()
    const {id} = useParams()
  const [stats, setStats] = useState(null);
  const [showAddLessonForm, setShowAddLessonForm] = useState(false);
  const [progress,setProgress] = useState(0)

  const [courseData, setCourseData] = useState({});
   const [lessons, setLessons] = useState([]);

  const fetchStats = async (courseId) => {
    try {
      const response = await fetch(`https://edulearn-hn19.onrender.com/stats/course/${courseId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials:'include',
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data.details);
      } else {
        console.error('Failed to fetch course data');
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    }
  };
   const fetchProgress = async() => {
    try {
      const response = await fetch(`https://edulearn-hn19.onrender.com/progress/course/${id}/user/${userDetails.id}`,{credentials:'include',})
      if (response.ok){
        const data = await response.json()
        setProgress(data.details?.percent)
        console.log(data)
      }
    } catch (error) {
      toast.error("Error fetching Progress data")
      console.error('Error fetching Progress data:', error);
    }
    
   }
    const fetchCourseData = async (courseId) => {
    try {
      const response = await fetch(`https://edulearn-hn19.onrender.com/courses/${courseId}`, {
        headers: {
          "Content-Type": "application/json",
        },credentials:'include',
      });
      if (response.ok) {
        const data = await response.json();
        setCourseData(data.details);
        console.log(data)
      } else {
        console.error('Failed to fetch course data');
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    }
  }
  const fetchLessons = async (courseId) => {
    try {
      const response = await fetch(`https://edulearn-hn19.onrender.com/courses/${courseId}/lessons`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials:'include',
      });
      if (response.ok) {
        const data = await response.json();
        setLessons(data.details);
      } else {
        console.error('Failed to fetch lessons data');
      }
    } catch (error) {
      console.error('Error fetching lessons data:', error);
    }
  };

  useEffect(() => {
    fetchStats(id);
    fetchCourseData(id);
    fetchLessons(id);
    fetchProgress();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{courseData.title}</h1>
                <p className="text-gray-600 mt-1">Manage lessons and course content</p>
              </div>
              {userDetails.role != "student" && <button 
                onClick={() => setShowAddLessonForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-all flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Lesson
              </button>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Course Level</p>
                <p className="font-semibold text-gray-900">{courseData.level}</p>
              </div>
            </div>
            {userDetails.role != "student" && <div className="flex items-center">
              <Users className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Enrolled Students</p>
                <p className="font-semibold text-gray-900">{stats?.enrolledStudents}</p>
              </div>
            </div>}
            {userDetails.role == "student" && <div className="flex items-center w-full ">
              <CheckCircle className="w-5 h-5 text-purple-600 mr-2" />
              <div className="mb-4 w-[80%]">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>Course Progress</span>
              </div>
              <div className='flex justify-center items-center'>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full bg-green-500`} style={{ width: `${progress}%` }}></div>
              </div>
              <span>{progress}%</span>
              </div>
              
              
            </div>
            </div>}
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-orange-600 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Total Lessons</p>
                <p className="font-semibold text-gray-900">{stats?.totalLessons}</p>
              </div>
            </div>
          </div>
        </div>

        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 flex justify-between items-center">
          <div className=''>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Course Description</h2>
          <p className="text-gray-600">{courseData.description}</p>
          </div>
          <Link to={`/progress/${id}`}>
            <button className='bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg'>Students Progress</button>
          </Link>
        </div>

        {/* Lessons List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Course Lessons</h2>
              <span className="text-sm text-gray-500">{lessons.length} lessons</span>
            </div>
          </div>
          <div className="p-6">
            {lessons.length > 0 ? (
              <div className="space-y-4">
                {lessons.map((lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No lessons yet</h3>
                <p className="text-gray-500 mb-6">Start building your course by adding your first lesson</p>
                {userDetails.role === "instructor" && <button
                  onClick={() => setShowAddLessonForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors flex items-center mx-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Lesson
                </button>}
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
      {/* Add Lesson Form Modal */}
      {showAddLessonForm && <AddLessonForm setShowAddLessonForm={setShowAddLessonForm} id={id} created_by={userDetails.id} />}
    </div>
  );
};

export default CourseDetail;