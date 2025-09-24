import React, { useEffect, useState } from 'react';
import { X, BookOpen, Save, Upload } from 'lucide-react';

const CreateCourse = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    instructor_id: '',
    level: '',
    status: 'draft',
    created_by : 1
  });
  const [error,setError] = useState(null);
  const [instructorOptions, setInstructorOptions] = useState([]);
  const fetchInstructors = async () => {
    try {
      const response = await fetch('https://edulearn-hn19.onrender.com/instructors',{credentials:'include'});
      const data = await response.json();
      console.log(data);
      setInstructorOptions(data.details.map(inst => ({ value: inst.id, label: `${inst.username} - ${inst.department}` })));
    } catch (err) {
      console.error('Error fetching instructors:', err);
      return [];
    }
  };
  useEffect(() => {fetchInstructors()}, []);

  const categoryOptions = [
    'Web Development', 'Mobile Development', 'Data Science', 
    'Machine Learning', 'UI/UX Design', 'Database Management'
  ];

  const levelOptions = ['Beginner', 'Intermediate', 'Advanced'];

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.category || 
        !formData.instructor_id || !formData.level) {
      setError('Please fill all required fields');
      return;
    }
    onSave(formData);
    setFormData({
      title: '', description: '', category: '', instructor_id: '', 
      level: '', status: 'draft'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Create New Course</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form className="space-y-6">
          
          {/* Course Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter course title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the course content"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Instructor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructor *
              </label>
              <select
                value={formData.instructor_id}
                onChange={(e) => setFormData({...formData, instructor_id: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select instructor</option>
                {instructorOptions.map((instructor) => (
                  <option key={instructor.value} value={instructor.value}>
                    {instructor.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level *
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({...formData, level: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select level</option>
                {levelOptions.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            
          </div>

          {/* Status */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Course Status
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, status: 'draft'})}
                className={`flex-1 py-3 px-4 border rounded-lg transition-colors ${
                  formData.status === 'draft'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, status: 'active'})}
                className={`flex-1 py-3 px-4 border rounded-lg transition-colors ${
                  formData.status === 'active'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Publish Course
              </button>
            </div>
          </div> */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button onClick={onClose} className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel</button>
            <button onClick={handleSubmit}className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all flex items-center"><Save className="w-4 h-4 mr-2" />Create Course</button>
          </div>
        </form>
      </div>
    </div>
  );
};



export default CreateCourse;