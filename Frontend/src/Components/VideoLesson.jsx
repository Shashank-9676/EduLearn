import { X, Video, Circle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
const VideoLesson = ({ lesson, isOpen, onClose,completed, setCompleted }) => {
  const {userDetails} = useAuth();
if (!isOpen || !lesson) return null;
  const handleToggle = async() => {
    try {
      const response = await fetch('http://localhost:3000/progress/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userDetails.id, // Replace with actual user ID
          lesson_id: lesson.lesson_id,
          status: 1 ,
        })
      });
      console.log("Response:",response)
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Failed to update progress');
        return;
      }
      setCompleted(true);
    } catch (error) {
      console.log("Handle Completed:",error)
    }
    
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080] overflow-y-auto p-4 h-screen">
      <div className=" bg-white rounded-xl w-full max-w-4xl mx-4">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Video className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{lesson.title}</h2>
              <p className="text-sm text-gray-500">Lesson {lesson.lesson_order}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Content */}
        <div className="p-6">
          <div className="bg-black rounded-lg overflow-hidden mb-4">
            <iframe width="100%" height="400" src={`https://www.youtube.com/embed/${lesson.content_url}`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
          
          {/* Lesson Description */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">About This Lesson</h3>
            <p className="text-gray-600">{lesson.description}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-end gap-6">
            <button onClick={onClose} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors cursor-pointer">Close</button>
            {!completed ? <button onClick={handleToggle} className={"flex items-center gap-2 px-4 py-2 rounded-md font-medium text-white transition cursor-pointer bg-blue-600 hover:bg-blue-700"}>
              <Circle size={18} />
              Mark as Complete
            </button> : 
            <button className='flex items-center gap-2 px-4 py-2 rounded-md font-medium text-white transition cursor-pointer bg-green-600 hover:bg-green-700'>
              <CheckCircle size={18} /> 
              Completed
            </button>}
          </div>
        </div>
      </div>
    </div>
  );
};



export default VideoLesson;