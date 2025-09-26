import { useState } from "react";
import { Plus, X, Save } from "lucide-react";

const AddLessonForm = ({ setShowAddLessonForm, id, created_by }) => {
  const [newLesson, setNewLesson] = useState({
    title: "",
    lesson_order: "",
    content_url: "",
    created_by: created_by
  });
    const handleAddLesson = async (e) => {
        e.preventDefault();
    if (!newLesson.title || !newLesson.content_url) {
      alert('Please fill all required fields');
      return;
    }
    
    // setLessons([...lessons, lesson]);
    try {
      const response = await fetch(`https://edulearn-hn19.onrender.com/courses/${id}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },credentials:'include',
        body: JSON.stringify(newLesson),
      });
      if (!response.ok) {
        console.log('Failed to add lesson');
        return;
      }else{
        // const data = await response.json();
        setNewLesson({ title: '', description: '', type: 'video', duration: '', content: null });
        setShowAddLessonForm(false);
        alert('Lesson added successfully!');
        window.location.reload();
      }
      
    } catch (error) {
      console.error('Error adding lesson:', error);
    }
  };


  // single handler for all inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLesson((prev) => ({ ...prev, [name]: value }));
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080] bg-opacity-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Plus className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Add New Lesson</h2>
          </div>
          <button 
            type="button"
            onClick={() => setShowAddLessonForm(false)} 
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleAddLesson}>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Lesson Title *
            </label>
            <input
              type="text"
              name="title"
              value={newLesson.title}
              onChange={handleChange}
              placeholder="Enter lesson title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <input
                type="number"
                name="lesson_order"
                value={newLesson.lesson_order}
                onChange={handleChange}
                placeholder="Enter lesson order"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Code *
              </label>
              <input
                type="text"
                name="content_url"
                value={newLesson.content_url}
                onChange={handleChange}
                placeholder="Enter content URL Code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowAddLessonForm(false)}
              className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Add Lesson
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLessonForm;
