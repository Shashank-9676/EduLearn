  import { Video, FileText, Edit, Trash2, CheckCircle, Calendar } from 'lucide-react';
  import { useEffect, useState } from 'react';
  import VideoLesson from './VideoLesson';
  import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import SyncLoader from 'react-spinners/SyncLoader';
  const LessonCard = ({ lesson }) => {
      const {userDetails} = useAuth()
      const [selectedLesson, setSelectedLesson] = useState(null);
      const [completed, setCompleted] = useState(0);
      const [isOpen, setIsOpen] = useState(false);
      const [isEditing, setIsEditing] = useState(false);
      const [loading, setLoading] = useState(true);
      const [formData, setFormData] = useState({
        title: lesson.title,
        content_url: lesson.content_url,
      });
        const openVideo = () => {
        setSelectedLesson(lesson);
        setIsOpen(true);
    };
      const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditLesson = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://edulearn-hn19.onrender.com/courses/lessons/${lesson.lesson_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // const updated = await response.json();
        toast.success("Lesson updated successfully!");
      } else {
        const err = await response.json();
        toast.error(err.message || "Failed to update lesson");
      }
      setIsEditing(false);
    } catch (error) {
      console.log("Error updating lesson:", error);
      toast.error("Something went wrong");
    }
  };

  const handleDeleteLesson = async () => {
    try {
      const response = await fetch(`https://edulearn-hn19.onrender.com/courses/lessons/${lesson.lesson_id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Lesson deleted successfully!");
      } else {
        const err = await response.json();
        toast.error(err.message || "Failed to delete lesson");
      }
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast.error("Something went wrong");
    }
  };

    const fetchProgress = async () => {
      try {
        setLoading(true);
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
        setLoading(false);
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
      if(loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <SyncLoader color="#333333" size={15} />
      </div>
    );
      }
    return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3 " >
        <div className="flex items-center space-x-3 cursor-pointer" onClick={openVideo}>
          <div className={`p-2 rounded-lg ${lesson.type === 'video' ? 'bg-blue-100' : 'bg-green-100'}`}>
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
          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" onClick={handleDeleteLesson}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div> : <div className='flex flex-col items-center gap-7'><p>Progress</p>
          {completed ? <div><CheckCircle size={18} />Completed</div> : "not Completed"} </div>}
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
      {isEditing && (
      <form
      onSubmit={handleEditLesson}
      className="fixed inset-0 z-50 flex  items-center justify-center bg-[rgba(0,0,0,0.5)]"
    >
      <div className='bg-white rounded-xl p-8 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto'>
        <h2 className="text-2xl font-semibold mb-4 text-center">Edit Lesson</h2>

        <div>
          <label className="block text-gray-300 mb-1">Lesson Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-1">Content URL</label>
          <input
            type="text"
            name="content_url"
            value={formData.content_url}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition mr-3"
          >
            Update
          </button>
          <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition">Cancel</button>
        </div>
      </div>
      
    </form>)}
    </div>
  )};

export default LessonCard;