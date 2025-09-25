import  { useEffect, useState } from 'react';
import { Users, BookOpen,   UserPlus,  Clock,  Target,  Activity } from 'lucide-react';
import UserRow from './UserRow';
import AddUserPopup from './AddUserForm'
import StatCard from './StarCard';
const AdminDashboard = () => {
  const [stats,setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    activeUsers: 0,
    pendingEnrollments: 0
  });
    // const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [pendingEnrollments, setPendingEnrollments] = useState([]);
  // const handleSaveUser = async (userData) => {
  //   console.log('User data submitted:', userData);
  //   const response = await fetch('https://edulearn-hn19.onrender.com/enrollments', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },credentials:'include',
  //     body: JSON.stringify(userData),
  //   });
  //   const data = await response.json();
  //   console.log('Response from server:', data);
  //   fetchEnrollments();
  //   setIsPopupOpen(false);
  // };
  

  const fetchEnrollmentsCounts = async () => {
    try {
const response = await fetch("https://edulearn-hn19.onrender.com/stats/admin", {
  credentials: "include",
});
      const {details} = await response.json();
      setStats(details);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    }
  };
  const fetchEnrollments = async () => {
    try {
      const response = await fetch('https://edulearn-hn19.onrender.com/enrollments/',{credentials:'include'});
      const { details } = await response.json();
      setUsers(details);
      setPendingEnrollments(details.filter(user => user.status == "pending"));
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    }
  };
  console.log(pendingEnrollments);
  useEffect(() => {
    fetchEnrollmentsCounts();
    fetchEnrollments();
 },[])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your learning management system</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Users"
            value={stats?.totalUsers}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatCard
            icon={BookOpen}
            title="Total Courses"
            value={stats?.totalCourses}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <StatCard
            icon={Activity}
            title="Active Users"
            value={stats?.activeUsers}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          <StatCard
            icon={Clock}
            title="Pending Enrollments"
            value={stats?.pendingEnrollments}
            color="bg-gradient-to-r from-orange-500 to-orange-600"
          />
        </div>

        {/* Dashboard Content */}
        <div className="space-y-8">
          
          {/* Pending Enrollments Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Pending Enrollments</h2>
            </div>
            <div className="p-6">
              {pendingEnrollments?.length > 0 ? (
                <div className="overflow-hidden">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {pendingEnrollments?.map((user) => (
                        <UserRow key={user.id} user={user} />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No pending enrollments</p>
                </div>
              )}
            </div>
          </div>

          {/* All Users Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Users</h2>
              {/* <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center" onClick={() => setIsPopupOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" />Add User
              </button>
              <AddUserPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} onSave={handleSaveUser} /> */}
            </div>
            <div className="p-6">
              <div className="overflow-hidden">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users?.map((user) => (
                      <UserRow key={user.id} user={user} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;