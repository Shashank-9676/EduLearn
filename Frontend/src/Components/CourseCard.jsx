  import {Trash2, Eye,Edit } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import {ToastContainer,  toast } from 'react-toastify';
  const CourseCard = ({ course }) => {
    const {userDetails} = useAuth()
    const navigate = useNavigate();
    const viewDetails  = () => {
      if(userDetails.id !==course.instructor_id && userDetails.role == "instructor" || course.status == "pending") {
        toast.error("You don't have access to view this course");
        return;
      }
      navigate(`/course/${course.id}`);
    }
    const enrollment = async() => {
      const response = await fetch(`https://edulearn-hn19.onrender.com/enrollments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:'include',
        body: JSON.stringify({ course_id: course.id, user_id: userDetails.id })
      });
      const data = await response.json();
      if(!response.ok) {
        toast.error(data.message || "You don't have access to enroll in this course");
        return;
      }
      toast.success("Request Sent Successfully! Wait for the approval.");
    }
    return (
      
    <div className="bg-white  h-full rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Course Image */}
      <ToastContainer theme="colored"/>
      <div className="relative h-48  bg-gray-700 ">
        {course.status && <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            course.status === 'active' ? 'bg-green-100 text-green-800' : course.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
            {course.status}
          </span>
        </div>}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-xl font-bold mb-2 line-clamp-2">{course.title}</h3>
        </div>
      </div>

      {/* Course Content */}
      <div className=" p-6 flex flex-col justify-end mt-auto">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
            {course.category}
          </span>
          {/* {course.rating > 0 && (
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">{course.rating}</span>
            </div>
          )} */}
        </div>

        <p className="text-gray-600 text-sm mb-4 h-16 line-clamp-2">{course.description}</p>
        <div className="flex items-center justify-between mb-4">
          {userDetails.role != "instructor" ? <div>
            <p className="text-sm text-gray-500">Instructor</p>
            <p className="font-medium text-gray-900">{course.username}</p>
          </div> : <div></div>}
          <div className="text-right">
            <p className="text-sm text-gray-500">Level</p>
            <p className="font-medium text-gray-900">{course.level}</p>
          </div>
        </div>

        {userDetails.role == "admin" ? <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={viewDetails}>
              <Eye className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
              <Edit className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        : 
        userDetails.role == "instructor" ? 
        <div className="flex items-center justify-center pt-4 border-t border-gray-200">
          <div className="flex space-x-2 w-full">
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" onClick={viewDetails}>
              View Course
            </button>
          </div>
        </div> : <div className="flex items-center justify-center pt-4 border-t border-gray-200">
          <div className="flex space-x-2 w-full">
            {! course.course_id ? <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" onClick={enrollment}>Enroll Now</button> 
            : 
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" onClick={viewDetails}>View Course</button> }
            </div>
          </div>
          }
      </div>
    </div>
  )};
  export default CourseCard;