import  { useState, useEffect } from 'react';
import { User, Lock, Mail, Eye, EyeOff, GraduationCap, Phone, List, Cookie } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import { toast, ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
const Login = () => {

  const { setUserDetails } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [organizations, setOrganizations] = useState([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
      const res = await fetch('https://edulearn-hn19.onrender.com/form/organization-options', {credentials:'include'});
      const data = await res.json();
      setOrganizations(data.details || []);
      } catch (err) {
        console.log("Error fetching organizations:", err);
      } finally {
      setLoadingOrgs(false);
      }
    };
    fetchOrganizations();
  }, []);
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    contact: '',
    password: '',
    confirmPassword: '',
    organization_id: ''
  });
    const navigate = useNavigate();
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('https://edulearn-hn19.onrender.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginData.email, password: loginData.password }),
      credentials: 'include'
    });
    const data = await response.json();
    if (response.ok) {
      setError(null);
      localStorage.setItem('userDetails', JSON.stringify({ id: data.details.id, username: data.details.username, email: data.details.email, role: data.details.user_type, organization: data.details.org_name }));
      setUserDetails({ id: data.details.id, username: data.details.username, email: data.details.email, role: data.details.user_type, organization: data.details.org_name });
      navigate('/dashboard',{ replace: true });
    } else {
      setError(data.message || 'Login failed');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    const response = await fetch('https://edulearn-hn19.onrender.com/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: registerData.username,
        email: registerData.email,
        contact: registerData.contact,
        password: registerData.password,
        organization_id: registerData.organization_id,
      })
    });
    const data = await response.json();
    if (response.ok) {
      setError(null);
      setActiveTab('login');
    } else {
      setError(data.message || 'Registration failed');
    }
  };
  if (Cookies.get('jwt_token')) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>
      <ToastContainer />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">EduLearn</h1>
          <p className="text-blue-100">Your Learning Management System</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Tab Headers */}
          <div className="flex">
            <button onClick={() => setActiveTab('login')} className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-300 ${ activeTab === 'login' ? 'bg-white/20 text-white border-b-2 border-blue-400' : 'text-blue-100 hover:bg-white/10' }`}>Login</button>
            <button onClick={() => setActiveTab('register')} className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-300 ${ activeTab === 'register' ? 'bg-white/20 text-white border-b-2 border-blue-400' : 'text-blue-100 hover:bg-white/10'}`}>Register</button>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {activeTab === 'login' && (
              <form className="space-y-6 animate-fadeIn" onSubmit={handleLoginSubmit}>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 w-5 h-5" />
                  <input required name='email' type="email" placeholder="Email Address" value={loginData.email} onChange={(e) => setLoginData({...loginData, email: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"/>
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 w-5 h-5" />
                  <input required type={showPassword ? 'text' : 'password'} placeholder="Password" value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="text-left">
                  {error && <p className="text-red-300 text-sm mt-2">{error}</p>}
                </div>
                <button type='submit' className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">Sign In</button>
                <p className='text-center text-white'>Are you looking to create a Organization? contact <a href="https://mail.google.com/mail/?view=cm&fs=1&to=shashank09999999@gmail.com&su=Support%20Request," className="text-blue-200 hover:underline">edulearn</a></p>
              </form>
            )}

            {/* Register Form */}
            {activeTab === 'register' && (
              <form className="space-y-6 animate-fadeIn" onSubmit={handleRegisterSubmit}>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 w-5 h-5" />
                  <input required name='username' type="text" placeholder="Full Name" value={registerData.username} onChange={(e) => setRegisterData({...registerData, username: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"/>
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 w-5 h-5" />
                  <input required name='email' type="email" placeholder="Email Address" value={registerData.email} onChange={(e) => setRegisterData({...registerData, email: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"/>
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 w-5 h-5" />
                  <input required name='contact' type="tel" placeholder="Contact Number" value={registerData.contact} onChange={(e) => setRegisterData({...registerData, contact: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"/>
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 w-5 h-5" />
                  <input required type={showPassword ? 'text' : 'password'} placeholder="Password" value={registerData.password} onChange={(e) => setRegisterData({...registerData, password: e.target.value})} className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 w-5 h-5" />
                  <input required type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" value={registerData.confirmPassword} onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})} className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"/>
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white transition-colors">
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="relative">
                  <List className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 w-5 h-5" />
                  <select required name="organization" value={registerData.organization_id}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData, organization_id: e.target.value,
                      })
                    } className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                  >
                    <option value="" disabled>Select Organization</option>
                    {!loadingOrgs ? (
                      organizations.map((org) => (
                        <option key={org.id} value={org.id} style={{ color: 'black' }}>{org.name}</option>
                      ))
                    ) : (
                      <option>Loading...</option>
                    )}
                  </select>
                </div>
                <div className="flex items-center">{error && <p className="text-red-500 text-sm ml-2">{error}</p>}</div>
                <button type='submit' className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">Create Account</button>
                <p className='text-center text-white'>Are you looking to create a Organization? contact <a href="https://mail.google.com/mail/?view=cm&fs=1&to=shashank09999999@gmail.com&su=Support%20Request," target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:underline">edulearn</a></p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;