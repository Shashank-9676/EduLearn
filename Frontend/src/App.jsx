import Login from './Components/Login'
import Home from './Components/Home'
import Courses from './Components/Courses'
import { BrowserRouter,Routes, Route } from 'react-router'
import InstructorDashboard from './Components/InstructorDashboard'
import CourseDetail from './Components/CourseDetail'
import ProtectedRoute from './Components/ProtectedRoute'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute> <Home /></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute ><Courses /></ProtectedRoute>} />
        <Route path="/course/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
