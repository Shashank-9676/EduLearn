import Login from './Components/Login'
import Home from './Components/Home'
import Courses from './Components/Courses'
import { BrowserRouter,Routes, Route } from 'react-router'
import InstructorDashboard from './Components/InstructorDashboard'
// import CreateCourseFormDemo from './Components/AddCourseForm'
import CourseDetail from './Components/CourseDetail'
import ProgressCircle from './Components/ProgressCircle'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path='/' element={<InstructorDashboard />}/>
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="*" element={<ProgressCircle />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
