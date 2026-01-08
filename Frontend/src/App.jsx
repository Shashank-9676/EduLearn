import Login from './Components/Login'
import Home from './Components/Home'
import Courses from './Components/Courses'
import { BrowserRouter,Routes, Route, Navigate } from 'react-router'
import CourseDetail from './Components/CourseDetail'
import ProtectedRoute from './Components/ProtectedRoute'
import StudentProgress from './Components/StudentProgress'
import About from './Components/About'
import { ToastContainer } from 'react-toastify'
import NotFound from './Components/NotFound'
import Contact from './Components/Contact'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute> <Home /></ProtectedRoute>} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute> } />
        <Route path="/progress/:id" element={<ProtectedRoute><StudentProgress /></ProtectedRoute>} />
        <Route path="/about" element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <ToastContainer theme="colored" />
    </BrowserRouter>
  )
}

export default App
