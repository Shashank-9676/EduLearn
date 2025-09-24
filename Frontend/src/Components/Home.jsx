import React from 'react'
import Header from './Header'
import AdminDashboard from './AdminDashboard'
import InstructorDashboard from './InstructorDashboard'
import StudentDashboard from './StudentDashboard'
import { useAuth } from '../context/AuthContext'

function Home() {
  const {userDetails} = useAuth()
  return (
    <div>
      <Header />
      {userDetails.role === 'instructor' ? <InstructorDashboard /> : userDetails.role === 'student' ? <StudentDashboard /> : null}
      {userDetails.role === 'admin' && <AdminDashboard />}
    </div>
  )
}

export default Home