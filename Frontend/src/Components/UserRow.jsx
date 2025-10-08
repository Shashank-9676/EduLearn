  import { Check, X } from "lucide-react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
  const UserRow = ({ user }) => {
    const [isEdit, setIsEdit] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const handleEdit = async () => {
      const response = await fetch(`https://edulearn-hn19.onrender.com/enrollments/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:'include',
        body: JSON.stringify({
          status: isEdit ? 'active' : 'inactive',
        }),
      });
      if(!response.ok) {
        toast.error("Error updating enrollment status");
        return;
      }
      const data = await response.json();
      console.log(data);
      window.location.reload();
    }
    return(
      <>
      <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
            {user.student_name[0].toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{user.student_name}</div>
            <div className="text-sm text-gray-500">{user.student_email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          user.user_type === 'admin' ? 'bg-purple-100 text-purple-800' :
          user.user_type === 'instructor' ? 'bg-blue-100 text-blue-800' :
          'bg-green-100 text-green-800'
        }`}>
          {user.user_type}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.enrolled_at).toDateString()}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {user.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button className={` ${user.status !== 'active' ? 'flex items-end gap-2 px-4 py-2 bg-green-500 text-white rounded-[60%] mb-2 cursor-pointer ml-auto' : 'hidden'}`} onClick={() => {setIsEdit(!isEdit); setIsDelete(false);}}>
            <Check size={20} />
          </button>
          <button className="flex justify-center items-center gap-2 px-4 py-2 bg-red-400 text-white rounded-[60%] cursor-pointer ml-auto" onClick={() => {setIsDelete(!isDelete); setIsEdit(false);}}>
            <X size={20} /> 
          </button>
      </td>
    </tr>
      {(isEdit || isDelete) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-96">
        <div className="flex items-center gap-3 mb-4">
          {isEdit ? (
            <Check className="text-green-600" size={32} />
          ) : (
            <X className="text-red-600" size={32} />
          )}
          <h2 className="text-xl font-semibold">
            {isEdit ? "Edit User" : "Delete User"}
          </h2>
        </div>

        <p className="text-gray-600 mb-6">
          Are you sure you{isEdit ? "" : " don't"} want to Enroll the student?
        </p>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 cursor-pointer"
            onClick={() => {setIsEdit(false); setIsDelete(false);}}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded text-white cursor-pointer ${
              isEdit
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
            onClick={() => {
              handleEdit()
              setIsEdit(false);
              setIsDelete(false);
            }}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>

      )}
    </>
    ) 
}
    export default UserRow;