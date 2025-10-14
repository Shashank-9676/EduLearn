import Login from './Components/Login'
import Home from './Components/Home'
import Courses from './Components/Courses'
import { BrowserRouter,Routes, Route, Navigate } from 'react-router'
import CourseDetail from './Components/CourseDetail'
import ProtectedRoute from './Components/ProtectedRoute'
import StudentProgress from './Components/StudentProgress'
import { ToastContainer } from 'react-toastify'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute> <Home /></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute ><Courses /></ProtectedRoute>} />
        <Route path="/course/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute> } />
        <Route path="/progress/:id" element={<ProtectedRoute><StudentProgress /></ProtectedRoute>} />
        <Route path='*' element={<ProtectedRoute><Navigate to={'/dashboard'} /></ProtectedRoute>} />
      </Routes>
      <ToastContainer theme="colored" />
    </BrowserRouter>
  )
}

export default App
