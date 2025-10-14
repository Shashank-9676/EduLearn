import React, { useEffect, useState } from 'react';
import { X, BookOpen, Save, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CustomSelect from './CustomSelect';
const CreateCourse = ({ isOpen, onClose, onSave }) => {
  const {userDetails} = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    instructor_id: '',
    level: '',
    status: 'draft',
    created_by : userDetails.id
  });
  const [error,setError] = useState(null);
  const [instructorOptions, setInstructorOptions] = useState([]);
  const fetchInstructors = async () => {
    try {
      const response = await fetch('https://edulearn-hn19.onrender.com/instructors',{credentials:'include'});
      const data = await response.json();
      setInstructorOptions(data.details.map(inst => ({ value: inst.id, label: `${inst.username} - ${inst.department}` })));
    } catch (err) {
      console.error('Error fetching instructors:', err);
      return [];
    }
  };
  useEffect(() => {
    if(userDetails.role == "admin") {
    fetchInstructors()
    }
  }, []);

  const categoryOptions = [
    'Web Development', 'Mobile Development',  
    'Machine Learning', 'UI/UX Design', 'Database Management', "Programming Languages"
  ];

  const levelOptions = ['Beginner', 'Intermediate', 'Advanced'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category || !formData.instructor_id || !formData.level) {
      setError('Please fill all required fields');
      return;
    }
    setError(null);
    onSave(formData);
    setFormData({
      title: '', description: '', category: '', instructor_id: '', level: '', status: 'draft', created_by : userDetails.id
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
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
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor='title'>Course Title *</label>
            <input required name='title' id='title' type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Enter course title" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor='description'>Description *</label>
            <textarea required id='description' rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe the course content" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <CustomSelect options={categoryOptions.map(cat => ({value: cat, label: cat}))} value={formData.category} onChange={(value) => setFormData({...formData, category: value})} placeholder="Select category" label="Select Category" />
            </div>

            {/* Instructor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instructor *</label>
              <CustomSelect options={instructorOptions} value={formData.instructor_id} onChange={(value) => setFormData({...formData, instructor_id: value})} placeholder="Select Instructor" label="Instructor" />
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level *</label>
              <CustomSelect options={levelOptions.map(lvl => ({value: lvl, label: lvl}))} value={formData.level} onChange={(value) => setFormData({...formData, level: value})} placeholder="Select level" label="Select Level" />
            </div>
          </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button type='button' onClick={onClose} className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel</button>
            <button type="submit" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all flex items-center"><Save className="w-4 h-4 mr-2" />Create Course</button>
          </div>
        </form>
      </div>
    </div>
  );
};



export default CreateCourse;