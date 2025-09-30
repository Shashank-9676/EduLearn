  import { Video, FileText, Edit, Trash2, CheckCircle, Calendar } from 'lucide-react';
  import { useEffect, useState } from 'react';
  import VideoLesson from './VideoLesson';
  import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
  const LessonCard = ({ lesson }) => {
      const {userDetails} = useAuth()
      const [selectedLesson, setSelectedLesson] = useState(null);
      const [completed, setCompleted] = useState(0);
      const [isOpen, setIsOpen] = useState(false);
        const openVideo = () => {
        setSelectedLesson(lesson);
        setIsOpen(true);
    };
    const fetchProgress = async () => {
      try {
        const response = await fetch(`https://edulearn-hn19.onrender.com/progress/lesson/${lesson.lesson_id}/user/${userDetails.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials:'include',
        });
        const data = await response.json();
        if (response.ok) {
          setCompleted(data.details?.status);
        } else {
          toast.error(data.message);
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };
  useEffect(() => {
    fetchProgress();
  }, [lesson.lesson_id, completed]);
    const closeVideo = () => {
        setIsOpen(false);
        setSelectedLesson(null);
  };

    return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3 cursor-pointer" onClick={openVideo}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            lesson.type === 'video' ? 'bg-blue-100' : 'bg-green-100'
          }`}>
            {lesson.type !== 'video' ? (
              <Video className={`w-5 h-5 ${lesson.type === 'video' ? 'text-blue-600' : 'text-green-600'}`} />
            ) : (
              <FileText className={`w-5 h-5 ${lesson.type === 'video' ? 'text-blue-600' : 'text-green-600'}`} />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{lesson.title}</h3>
            <p className="text-sm text-gray-500">Lesson {lesson.lesson_order}</p>
          </div>
        </div>
        {userDetails.role !== 'student' ? <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div> : <div className='flex flex-col items-center gap-7'><p>Progress</p>
          {completed ? <div>
            <CheckCircle size={18} />
            Completed</div> : "not Completed"} </div>}
      </div>

      <p className="text-gray-600 text-sm mb-4">{lesson.description}</p>
      <div className="flex items-center text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(lesson.created_at).toDateString()}
          </div>
        </div>
        <button className="cursor-pointer ml-[40%]" onClick={openVideo}>See Lesson</button>

      </div>
      <VideoLesson lesson={selectedLesson} isOpen={isOpen} onClose={closeVideo} completed={completed} setCompleted={setCompleted}/>
      <ToastContainer />
    </div>
  )};

export default LessonCard;