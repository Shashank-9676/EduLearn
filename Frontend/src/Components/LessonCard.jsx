import { Video, FileText, Edit, Trash2, CheckCircle, Calendar, PlayCircle, Clock, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import VideoLesson from './VideoLesson';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import SyncLoader from 'react-spinners/SyncLoader';

const LessonCard = ({ lesson }) => {
  const { userDetails } = useAuth();
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
    e.stopPropagation();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/courses/lessons/${lesson.lesson_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Lesson updated successfully!");
      } else {
        const err = await response.json();
        toast.error(err.message || "Failed to update lesson");
      }
      setIsEditing(false);
      window.location.reload(); // Reload to reflect changes
    } catch (error) {
      console.log("Error updating lesson:", error);
      toast.error("Something went wrong");
    }
  };

  const handleDeleteLesson = async (e) => {
    e.stopPropagation();
    if(!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/courses/lessons/${lesson.lesson_id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Lesson deleted successfully!");
        window.location.reload();
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/progress/lesson/${lesson.lesson_id}/user/${userDetails?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setCompleted(data.details?.status);
      } else {
        // silently fail or just log
        // toast.error(data.message); 
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching progress:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if(userDetails) {
        fetchProgress();
    } else {
        setLoading(false);
    }
  }, [lesson.lesson_id, completed, userDetails]);

  const closeVideo = () => {
    setIsOpen(false);
    setSelectedLesson(null);
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-6 h-full flex items-center justify-center min-h-[160px]">
        <SyncLoader color="#E5E7EB" size={10} />
      </div>
    );
  }

  // Determine icon based on type (simple check)
  const isVideo = lesson.type === 'video' || lesson.content_url?.includes('youtube') || lesson.content_url?.endsWith('.mp4');

  return (
    <>
      <div onClick={openVideo}
        className="group relative cursor-pointer bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:border-blue-200 flex flex-col h-full"
      >
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl flex-shrink-0 ${completed ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300'}`}>
              {isVideo ? (
                <Video className="w-6 h-6" />
              ) : (
                <FileText className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Lesson {lesson.lesson_order}</span>
                {userDetails?.role === 'student' && completed === 1 && (
                  <span className="flex items-center gap-1 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    <CheckCircle className="w-3 h-3" /> Completed
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1" title={lesson.title}>
                {lesson.title}
              </h3>
            </div>
          </div>
          
          {/* Admin/Instructor Actions */}
          {userDetails?.role !== 'student' && (
            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={(e) => {e.stopPropagation(); setIsEditing(true)}} 
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit Lesson"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={handleDeleteLesson} 
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Lesson"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="flex-grow">
             <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">{lesson.description || "No description provided."}</p>
        </div>

        {/* Footer info & Action */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-400 font-medium">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            {new Date(lesson.created_at).toLocaleDateString()}
          </div>
          
          <button 
            onClick={openVideo}
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300"
          >
            {userDetails?.role === 'student' ? (completed ? 'Review' : 'Start') : 'Preview'}
            {userDetails?.role === 'student' && !completed ? <PlayCircle className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Video Modal */}
      <VideoLesson lesson={selectedLesson} isOpen={isOpen} onClose={closeVideo} completed={completed} setCompleted={setCompleted}/>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080] backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-auto transform transition-all scale-100">
            <div className="mb-6 border-b pb-4">
                 <h2 className="text-xl font-bold text-gray-900">Edit Lesson</h2>
                 <p className="text-sm text-gray-500 mt-1">Update the lesson details below.</p>
            </div>

            <form onSubmit={handleEditLesson} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Lesson Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Content URL</label>
                <div className="relative">
                    <input
                    type="text"
                    name="content_url"
                    value={formData.content_url}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                    />
                     <Video className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-2">
                <button 
                    type="button" 
                    onClick={() => setIsEditing(false)} 
                    className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LessonCard;