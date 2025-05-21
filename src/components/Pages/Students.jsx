import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';

function Students() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    email: '',
    studentClass: '',
    address: '',
    age: '',
    gender: 'male'
  });
  const [loading, setLoading] = useState(false);

  // Starting Roll Number
  const startRollNo = 70135200;

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: value 
    });
  };

  // Load students from Firestore
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "students"));
        const studentsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setStudents(studentsData);
      } catch (error) {
        console.error("Error fetching students: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const newStudent = {
        rollNo: startRollNo + students.length,
        ...formData
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, "students"), newStudent);
      
      // Update local state
      setStudents([...students, { id: docRef.id, ...newStudent }]);

      // Clear the form
      setFormData({
        name: '',
        fatherName: '',
        email: '',
        studentClass: '',
        address: '',
        age: '',
        gender: 'male'
      });

    } catch (error) {
      console.error("Error adding student: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "students", id));
      setStudents(students.filter(student => student.id !== id));
    } catch (error) {
      console.error("Error deleting student: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gradient-to-br from-teal-50 via-white to-green-100 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Animated Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-teal-800 animate-fade-in">
            🎓 Student Enrollment System
          </h2>
          <p className="text-teal-600 animate-fade-in-delay">Empowering education through digital enrollment</p>
        </div>

        {/* Enhanced Form */}
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-xl space-y-4 border-2 border-teal-200 hover:shadow-2xl transition-all duration-500 hover:border-teal-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-teal-700">Student Name</label>
              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-teal-700">Father's Name</label>
              <input
                type="text"
                name="fatherName"
                placeholder="Father's name"
                value={formData.fatherName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-teal-700">Age</label>
              <input
                type="number"
                name="age"
                placeholder="Age"
                min="5"
                max="25"
                value={formData.age}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-teal-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-teal-700">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-teal-700">Class</label>
              <input
                type="text"
                name="studentClass"
                placeholder="Class/Grade"
                value={formData.studentClass}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-teal-700">Address</label>
            <textarea
              name="address"
              placeholder="Full address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-all"
              rows="3"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-600 to-teal-500 text-white font-semibold py-3 rounded-lg hover:from-teal-500 hover:to-teal-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 disabled:opacity-70"
          >
            {loading ? (
              <span>⏳ Processing...</span>
            ) : (
              <>
                <span>➕</span>
                <span>Enroll Student</span>
              </>
            )}
          </button>
        </form>

        {/* Enhanced Students Table */}
        {loading && students.length === 0 ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
            <p className="mt-2 text-teal-600">Loading students...</p>
          </div>
        ) : students.length > 0 ? (
          <div className="max-w-7xl mx-auto mt-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl md:text-2xl font-semibold text-teal-800 flex items-center">
                <span className="mr-2">📋</span>
                <span>Enrolled Students</span>
              </h3>
              <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                Total: {students.length}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition duration-500">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-teal-600 to-teal-500">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Roll No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Age/Gender</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Class</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Contact Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr 
                        key={student.id} 
                        className="hover:bg-teal-50 transition duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.rollNo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-xs text-gray-500">{student.fatherName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.age} yrs</div>
                          <div className="text-xs text-gray-500 capitalize">{student.gender}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.studentClass}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.email}</div>
                          <div className="text-xs text-gray-500 truncate max-w-xs">{student.address}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDelete(student.id)}
                            disabled={loading}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs transition-all duration-300 shadow-sm hover:shadow-md flex items-center disabled:opacity-70"
                          >
                            <span className="mr-1">🗑️</span>
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto mt-16 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-dashed border-teal-200 hover:border-teal-300 transition duration-500">
              <div className="text-6xl mb-4 animate-bounce">📝</div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No students enrolled yet</h3>
              <p className="text-gray-500 mb-4">Fill out the enrollment form above to get started!</p>
              <div className="w-16 h-1 bg-teal-400 mx-auto mb-6"></div>
              <p className="text-sm text-gray-400">Your student records will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Students;