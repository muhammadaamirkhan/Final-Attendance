import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';

function Faculty() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    education: '',
    university: '',
    address: '',
    specialization: 'science'
  });

  const [teachers, setTeachers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const facultyCollectionRef = collection(db, "faculty");

  const scienceSubjects = ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science'];
  const artsSubjects = ['English', 'Urdu', 'History', 'Geography', 'Drawing', 'Music'];
  const commerceSubjects = ['Accounting', 'Economics', 'Business Studies', 'Statistics'];
  const otherSubjects = ['Physical Education', 'Islamic Studies', 'Pakistan Studies'];

  useEffect(() => {
    const getFaculty = async () => {
      setLoading(true);
      try {
        const data = await getDocs(facultyCollectionRef);
        const facultyData = data.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTeachers(facultyData);
      } catch (error) {
        console.error("Error fetching faculty: ", error);
      } finally {
        setLoading(false);
      }
    };

    getFaculty();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      try {
        await deleteDoc(doc(db, "faculty", id));
        setTeachers(teachers.filter(t => t.id !== id));
      } catch (error) {
        console.error("Error deleting faculty: ", error);
      }
    }
  };

  const calculateEndTime = (startTime) => {
    const [time, period] = startTime.split(' ');
    let [hour, minute] = time.split(':').map(Number);

    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    let totalMinutes = hour * 60 + minute + 90;
    let endHour = Math.floor(totalMinutes / 60) % 24;
    let endMinute = totalMinutes % 60;

    const endPeriod = endHour >= 12 ? 'PM' : 'AM';
    endHour = endHour % 12 || 12;

    return `${endHour}:${endMinute === 0 ? '00' : '30'} ${endPeriod}`;
  };

  const getInitials = (name) => {
    if (!name) return 'NA';
    const names = name.split(' ');
    let initials = names[0].charAt(0).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].charAt(0).toUpperCase();
    }
    return initials;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    const randomClass = Math.floor(Math.random() * 10) + 1;
    let assignedSubject = '';

    switch (formData.specialization) {
      case 'science':
        assignedSubject = scienceSubjects[Math.floor(Math.random() * scienceSubjects.length)];
        break;
      case 'arts':
        assignedSubject = artsSubjects[Math.floor(Math.random() * artsSubjects.length)];
        break;
      case 'commerce':
        assignedSubject = commerceSubjects[Math.floor(Math.random() * commerceSubjects.length)];
        break;
      default:
        assignedSubject = otherSubjects[Math.floor(Math.random() * otherSubjects.length)];
    }

    const hour = Math.floor(Math.random() * 7) + 8;
    const minute = Math.random() > 0.5 ? '00' : '30';
    const startTime = `${hour}:${minute} ${hour >= 12 ? 'PM' : 'AM'}`;
    const endTime = calculateEndTime(startTime);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const selectedDays = [];
    const numDays = Math.floor(Math.random() * 4) + 2;

    while (selectedDays.length < numDays) {
      const randomDay = days[Math.floor(Math.random() * days.length)];
      if (!selectedDays.includes(randomDay)) {
        selectedDays.push(randomDay);
      }
    }

    try {
      const newTeacher = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        education: formData.education,
        university: formData.university,
        address: formData.address,
        specialization: formData.specialization,
        assignedClass: randomClass,
        assignedSubject: assignedSubject,
        schedule: {
          days: selectedDays.join(', '),
          time: `${startTime} - ${endTime}`
        },
        createdAt: new Date()
      };

      const docRef = await addDoc(facultyCollectionRef, newTeacher);
      setTeachers([...teachers, { id: docRef.id, ...newTeacher }]);
      setShowAlert(true);

      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        education: '',
        university: '',
        address: '',
        specialization: 'science'
      });

      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error("Error adding faculty: ", error);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header with animated elements */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-900 mb-4">
            <span className="inline-block transform hover:scale-110 transition duration-300">🏫</span> 
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Faculty Hiring Portal
            </span>
          </h1>
          <p className="text-lg text-indigo-700 max-w-2xl mx-auto">
            Join our team of dedicated educators and inspire the next generation
          </p>
        </div>

        {/* Floating notification */}
        {showAlert && (
          <div className="fixed top-5 right-5 bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-lg shadow-lg z-50 animate-fade-in flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Faculty member added successfully!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Application Form Card */}
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-indigo-50 transform hover:-translate-y-1 transition duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-indigo-800">
                <span className="border-b-4 border-indigo-300 pb-1">Teacher Application</span>
              </h2>
              <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                Step 1 of 1
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['name', 'phone', 'email', 'education', 'university'].map((field) => (
                  <div key={field} className="relative">
                    <label className="block text-sm font-medium text-indigo-700 mb-1">
                      {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input
                      type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all shadow-sm"
                    />
                  </div>
                ))}
              </div>

              {/* Specialization Select */}
              <div className="relative">
                <label className="block text-sm font-medium text-indigo-700 mb-1">Specialization</label>
                <div className="relative">
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all appearance-none shadow-sm bg-white"
                  >
                    <option value="science">Science</option>
                    <option value="arts">Arts</option>
                    <option value="commerce">Commerce</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="relative">
                <label className="block text-sm font-medium text-indigo-700 mb-1">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all shadow-sm"
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={formLoading}
                className={`w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 ${
                  formLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {formLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    <span>Submit Application</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Faculty Assignments Card */}
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-indigo-50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-indigo-800">
                <span className="border-b-4 border-indigo-300 pb-1">Faculty Assignments</span>
              </h2>
              <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                {teachers.length} Teachers
              </div>
            </div>

            {loading && teachers.length === 0 ? (
              <div className="text-center py-10">
                <div className="flex justify-center">
                  <svg className="animate-spin h-10 w-10 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2 mt-4">Loading faculty...</h3>
              </div>
            ) : teachers.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-6xl mb-4 text-indigo-200">👨‍🏫</div>
                <h3 className="text-xl font-medium text-gray-500">No faculty assignments yet</h3>
                <p className="text-gray-400 mt-2">Submitted applications will appear here</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {teachers.map((teacher) => {
                  // Safely handle potentially undefined properties
                  const teacherName = teacher.name || 'Unknown Teacher';
                  const teacherEducation = teacher.education || 'Education not specified';
                  const teacherUniversity = teacher.university || 'University not specified';
                  const teacherAssignedClass = teacher.assignedClass || 'N/A';
                  const teacherAssignedSubject = teacher.assignedSubject || 'Not assigned';
                  const scheduleDays = teacher.schedule?.days || 'Not scheduled';
                  const scheduleTime = teacher.schedule?.time || '';

                  return (
                    <div 
                      key={teacher.id} 
                      className="border border-gray-200 rounded-xl p-5 bg-gradient-to-r from-indigo-50 to-white hover:from-indigo-100 transition-all duration-300 group"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Teacher Avatar with initials */}
                        <div className="h-16 w-16 rounded-full bg-indigo-200 flex items-center justify-center text-white font-bold text-2xl shadow-md">
                          {getInitials(teacherName)}
                        </div>

                        {/* Teacher Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-indigo-900 truncate">{teacherName}</h3>
                          <p className="text-sm text-indigo-600 mb-2">{teacherEducation} from {teacherUniversity}</p>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg flex items-center">
                              <span className="font-medium mr-1">Class:</span>
                              <span className="font-bold">{teacherAssignedClass}</span>
                            </div>
                            <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg flex items-center">
                              <span className="font-medium mr-1">Subject:</span>
                              <span className="font-bold">{teacherAssignedSubject}</span>
                            </div>
                            <div className="col-span-2 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg">
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>{scheduleDays} | {scheduleTime}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <button 
                          onClick={() => handleDelete(teacher.id)}
                          className="text-gray-400 hover:text-red-500 transition p-1"
                          aria-label="Delete teacher"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Faculty;