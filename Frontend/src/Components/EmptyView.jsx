import React from 'react'
import { useNavigate } from 'react-router'
import { GraduationCap, BookOpen, ArrowRight, Clock,Users } from 'lucide-react'
function EmptyView() {
    const navigate = useNavigate()
  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to EduLearn!</h2>
            <p className="text-xl text-gray-600 mb-8">You haven't enrolled in any courses yet.</p>
            <p className="text-gray-500 mb-8">Explore our wide range of courses and start learning today. Build new skills and advance your career with expert-led courses.</p>
            <button onClick={() => navigate('/courses')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-8 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 flex items-center mx-auto">
              <BookOpen className="w-6 h-6 mr-3" />
              Browse Courses
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">Why Choose Our Platform?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Expert Instructors</h4>
              <p className="text-gray-600">Learn from industry professionals with years of real-world experience</p>
            </div>
            {/* Feature 2 */}
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><Clock className="w-8 h-8 text-green-600" /></div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Learn at Your Pace</h4>
              <p className="text-gray-600">Flexible learning schedule that fits your lifestyle and commitments</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"><Users className="w-8 h-8 text-purple-600" /></div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Join Community</h4>
              <p className="text-gray-600">Connect with fellow learners and build your professional network</p>
            </div>
          </div>
        </div>
      </div>

  )
}

export default EmptyView
