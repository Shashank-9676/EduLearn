import React from 'react';
import { GraduationCap,  Target,   Users,   Award,  BookOpen,  Lightbulb,  Heart,  Globe,  TrendingUp,  Star,  CheckCircle} from 'lucide-react';
import { useNavigate } from 'react-router'
import Header from './Header';
const About = () => {
  const navigate = useNavigate()
  
  const stats = [
    { icon: Users, value: '10,000+', label: 'Active Students' },
    { icon: BookOpen, value: '500+', label: 'Courses' },
    { icon: Award, value: '50+', label: 'Expert Instructors' },
    { icon: Star, value: '4.8', label: 'Average Rating' }
  ];

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To make quality education accessible to everyone, everywhere. We believe learning should be engaging, affordable, and transformative.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We constantly evolve our platform with cutting-edge technology to provide the best learning experience for our students.'
    },
    {
      icon: Heart,
      title: 'Community',
      description: 'Building a supportive community where learners and instructors connect, collaborate, and grow together.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Reaching learners across the world, breaking down barriers to education and creating opportunities for all.'
    }
  ];

  const features = [
    'Expert-led courses in various subjects',
    'Flexible learning at your own pace',
    'Interactive lessons',
    // 'Certificates upon completion',
    'Community support and forums',
    'Regular content updates'
  ];

  // const team = [
  //   { name: 'Dr. Sarah Johnson', role: 'CEO & Founder', image: 'SJ' },
  //   { name: 'Michael Chen', role: 'CTO', image: 'MC' },
  //   { name: 'Emily Davis', role: 'Head of Education', image: 'ED' },
  //   { name: 'James Wilson', role: 'Director of Operations', image: 'JW' }
  // ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <GraduationCap className="w-10 h-10 text-blue-600" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4">About EduLearn</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Empowering learners worldwide with accessible, high-quality education that transforms lives and careers.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="prose max-w-none text-gray-600 space-y-4">
            <p className="text-lg">
              EduLearn was founded in 2020 with a simple yet powerful vision: to democratize education and make learning accessible to everyone, regardless of their location or background.
            </p>
            <p className="text-lg">
              What started as a small platform with just 10 courses has grown into a thriving learning community with thousands of students and hundreds of expert instructors from around the world. Our platform has helped countless individuals achieve their personal and professional goals through quality education.
            </p>
            <p className="text-lg">
              Today, we continue to innovate and expand our offerings, always keeping our learners at the heart of everything we do. We're not just building a platform—we're building a movement for lifelong learning.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and shape the experience we create for our community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What We Offer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Image/Placeholder */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-12 text-white">
            <div className="text-center">
              <TrendingUp className="w-20 h-20 mx-auto mb-6 opacity-80" />
              <h3 className="text-2xl font-bold mb-4">Growing Every Day</h3>
              <p className="text-blue-100">
                Join thousands of learners who are transforming their careers and achieving their goals through our platform.
              </p>
            </div>
          </div>

          {/* Features List */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Offer</h2>
            <p className="text-gray-600 mb-8">
              We provide everything you need for a successful learning journey, from expert instruction to community support.
            </p>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      {/* <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Passionate educators and innovators dedicated to transforming online learning.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {member.image}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our community of learners and take the first step towards achieving your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-gray-100 py-3 px-8 rounded-lg font-semibold transition-colors">
              Browse Courses
            </button>
            <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 py-3 px-8 rounded-lg font-semibold transition-colors" onClick={() => navigate('/contact')}>
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;