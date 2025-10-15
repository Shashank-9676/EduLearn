import React, { useState,useEffect } from 'react';
import { X, Save,  UserPlus,  AlertCircle, Star } from 'lucide-react';
import { toast } from 'react-toastify';

const AddUserPopup = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    course_id: null,
    instructor_id: null,
    department : null
    });

  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState({
    users: [],
    courses: [],
    instructors: []
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch("https://edulearn-hn19.onrender.com/form/enrollment-options",{credentials:'include',});
        const data = await response.json();
        setOptions({
          users: data.users,
          courses: data.courses,
          instructors: data.instructors
        });
      } catch (error) {
        toast.error("Error fetching enrollment options")
        console.error("Error fetching enrollment options:", error);
      }
    };

    fetchOptions();
  }, []);

  const CustomSelect = ({ options, value, onChange, placeholder, label, error, renderOption }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOptions = options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOption = options.find(option => option.value === value);

    const handleSelect = (option) => {
      onChange(option.value);
      setIsOpen(false);
      setSearchTerm('');
    };

    return (
      <div className="relative p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full px-4 py-3 text-left bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              error ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
                {selectedOption ? selectedOption.label : placeholder}
              </span>
              <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="max-h-48 overflow-y-auto">
                {filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors"
                  >
                    {renderOption ? renderOption(option) : (
                      <span className="text-gray-900">{option.label}</span>
                    )}
                  </button>
                ))}
                {filteredOptions.length === 0 && (
                  <div className="px-4 py-3 text-gray-500 text-center">
                    No options found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </p>
        )}
      </div>
    );
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.instructor_id) newErrors.instructor_id = 'Instructor is required';
    if(!formData.department) newErrors.department = 'Department Is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      course_id: null,
      instructor_id: null,
      department : null
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#00000080]">
      {/* Backdrop */}
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="inline-block w-full max-w-2xl p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl sm:align-middle">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Add Instructor</h3>
                <p className="text-sm text-gray-500">Select a instructor who already registered</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-6">
            
            {/* User Selection */}
            <CustomSelect options={options.users} value={formData.instructor_id} onChange={(value) => handleInputChange('instructor_id', value)} placeholder="Select an Instructor" label="Instructor" error={errors.instructor_id} 
            renderOption={(option) => (
                <div>
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.email}</div>
                </div>
              )}
            />
            {/* Course Selection */}
            {/* <CustomSelect options={options.courses} value={formData.course_id} onChange={(value) => handleInputChange('course_id', value)} placeholder="Select a course" label="Course (optional)" error={errors.course_id}/> */}
            {/* Department Input */}
            <div className="relative p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">Department <span className="text-red-500">*</span></label>
              <input type="text" value={formData.department || ''} onChange={e => handleInputChange('department', e.target.value)} placeholder="Enter department" className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.department ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'}`}/>
              {errors.department && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.department}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button type="button" onClick={handleClose} className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors">Cancel</button>
              <button type="button" onClick={handleSubmit} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Save className="w-4 h-4 mr-2" />
                Save Instructor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserPopup;