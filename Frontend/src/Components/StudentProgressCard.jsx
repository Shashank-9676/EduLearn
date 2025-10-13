 const StudentProgressCard = ({ student }) => {
  const getProgressColor = (percent) => {
    if (percent === 100) return 'bg-green-500';
    if (percent >= 75) return 'bg-blue-500';
    if (percent >= 50) return 'bg-yellow-500';
    if (percent >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStatusBadge = (percent) => {
    if (percent === 100) return { text: 'Completed', color: 'bg-green-100 text-green-800' };
    if (percent > 0) return { text: 'In Progress', color: 'bg-blue-100 text-blue-800' };
    return { text: 'Not Started', color: 'bg-gray-100 text-gray-800' };
  };

    const status = getStatusBadge(student.percent);
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
              {student.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{student.username}</h3>
              <p className="text-sm text-gray-500">{student.email}</p>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>
            {status.text}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Course Progress</span>
            <span>{student.percent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(student.percent)}`}
              style={{ width: `${student.percent}%` }}
            ></div>
          </div>
        </div>

        {/* Student Details */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>Lessons Completed:</span>
            <span className="font-medium">{student.completed} / {student.total}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>User ID:</span>
            <span className="font-medium">#{student.user_id}</span>
          </div>
        </div>
      </div>
    );
  };

  export default StudentProgressCard;