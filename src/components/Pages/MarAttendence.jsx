import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion, addDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';

function MarAttendence() {
  const [faculty, setFaculty] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [rollNo, setRollNo] = useState('');
  const [student, setStudent] = useState(null);
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [pastAttendance, setPastAttendance] = useState([]);
  const [showPastAttendance, setShowPastAttendance] = useState(false);

  // Fetch faculty from Firestore
  useEffect(() => {
    const fetchFaculty = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "faculty"));
        const facultyData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFaculty(facultyData);
      } catch (error) {
        console.error("Error fetching faculty: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  // Fetch past attendance when faculty is selected
  useEffect(() => {
    if (!selectedFaculty) return;

    const fetchPastAttendance = async () => {
      setLoading(true);
      try {
        // Fetch from faculty's attendance records
        const facultyDoc = await getDoc(doc(db, "faculty", selectedFaculty.id));
        const facultyData = facultyDoc.data();
        const facultyAttendance = facultyData?.attendanceRecords || [];

        // Also fetch from the separate attendance collection
        const q = query(
          collection(db, "attendance"),
          where("facultyId", "==", selectedFaculty.id)
        );
        const querySnapshot = await getDocs(q);
        const attendanceData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Combine both sources and deduplicate by date
        const combinedAttendance = [...facultyAttendance, ...attendanceData];
        const uniqueAttendance = combinedAttendance.reduce((acc, current) => {
          const x = acc.find(item => item.date === current.date);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);

        setPastAttendance(uniqueAttendance);
      } catch (error) {
        console.error("Error fetching past attendance: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPastAttendance();
  }, [selectedFaculty]);

  // Handle roll number submission
  const handleRollNoSubmit = async (e) => {
    e.preventDefault();
    if (!rollNo) return;

    setLoading(true);
    try {
      // Find student with this roll number
      const studentsSnapshot = await getDocs(collection(db, "students"));
      const studentsData = studentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      const foundStudent = studentsData.find(s => s.rollNo === parseInt(rollNo));
      
      if (foundStudent) {
        setStudent(foundStudent);
        
        // Check if student already exists in attendance list
        const exists = attendanceList.some(item => item.rollNo === foundStudent.rollNo);
        if (!exists) {
          setAttendanceList(prev => [
            ...prev,
            {
              ...foundStudent,
              status: 'present', // default status
              timestamp: new Date().toISOString()
            }
          ]);
        }
      } else {
        alert('Student with this roll number not found');
      }
    } catch (error) {
      console.error("Error fetching student: ", error);
    } finally {
      setRollNo('');
      setLoading(false);
    }
  };

  // Update attendance status for a student
  const updateAttendanceStatus = (rollNo, status) => {
    setAttendanceList(prev =>
      prev.map(item =>
        item.rollNo === rollNo ? { ...item, status } : item
      )
    );
  };

  // Submit attendance to Firestore
  const submitAttendance = async () => {
    if (!selectedFaculty || attendanceList.length === 0) return;

    setLoading(true);
    try {
      const attendanceRecord = {
        facultyId: selectedFaculty.id,
        facultyName: selectedFaculty.name,
        date,
        students: attendanceList.map(item => ({
          studentId: item.id,
          rollNo: item.rollNo,
          name: item.name,
          status: item.status,
          timestamp: item.timestamp
        })),
        createdAt: new Date().toISOString()
      };

      // Get reference to the faculty document
      const facultyRef = doc(db, "faculty", selectedFaculty.id);
      
      // Add this attendance record to the faculty's attendance history
      await updateDoc(facultyRef, {
        attendanceRecords: arrayUnion(attendanceRecord)
      });

      // Also store in a separate attendance collection for easier querying
      const attendanceCollection = collection(db, "attendance");
      const docRef = await addDoc(attendanceCollection, attendanceRecord);
      const newAttendanceRecord = { id: docRef.id, ...attendanceRecord };

      // Update local state with the new record
      setPastAttendance(prev => [...prev, newAttendanceRecord]);
      
      alert('Attendance submitted successfully!');
      setAttendanceList([]);
      setStudent(null);
      setShowPastAttendance(true);
    } catch (error) {
      console.error("Error submitting attendance: ", error);
      alert('Failed to submit attendance');
    } finally {
      setLoading(false);
    }
  };

  // Delete attendance record
  const deleteAttendance = async (record) => {
    if (!window.confirm('Are you sure you want to delete this attendance record?')) return;

    setLoading(true);
    try {
      // Delete from faculty's attendance records
      const facultyRef = doc(db, "faculty", selectedFaculty.id);
      const facultyDoc = await getDoc(facultyRef);
      const facultyData = facultyDoc.data();
      
      // Filter out the record to be deleted
      const updatedRecords = facultyData.attendanceRecords.filter(r => 
        !(r.date === record.date && r.facultyId === record.facultyId)
      );
      
      await updateDoc(facultyRef, {
        attendanceRecords: updatedRecords
      });

      // Delete from attendance collection if it has an ID
      if (record.id) {
        await deleteDoc(doc(db, "attendance", record.id));
      }

      // Update local state
      setPastAttendance(prev => prev.filter(item => 
        !(item.date === record.date && (!item.id || item.id !== record.id))
      ));
      
      alert('Attendance record deleted successfully!');
    } catch (error) {
      console.error("Error deleting attendance: ", error);
      alert('Failed to delete attendance record');
    } finally {
      setLoading(false);
    }
  };

  // Filter attendance list based on status and search term
  const filteredAttendanceList = attendanceList.filter(item => {
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.rollNo.toString().includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  // Get status count for a record
  const getStatusCount = (record, status) => {
    return record.students.filter(s => s.status === status).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-blue-800">
            📝 Attendance Management System
          </h1>
          <p className="text-blue-600">Mark and manage student attendance records</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Faculty Selection Panel */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
            <h2 className="text-xl font-bold text-blue-800 mb-4 border-b pb-2">
              Available Faculty
            </h2>
            
            {loading && faculty.length === 0 ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-blue-600">Loading faculty...</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {faculty.map(teacher => (
                  <div 
                    key={teacher.id}
                    onClick={() => {
                      setSelectedFaculty(teacher);
                      setShowPastAttendance(false);
                    }}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${selectedFaculty?.id === teacher.id ? 'bg-blue-100 border-2 border-blue-300' : 'bg-gray-50 hover:bg-blue-50 border border-gray-200'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-200 text-blue-800 font-bold h-10 w-10 rounded-full flex items-center justify-center">
                        {teacher.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-900">{teacher.name}</h3>
                        <p className="text-sm text-blue-700">
                          {teacher.assignedSubject} (Class {teacher.assignedClass})
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Attendance Marking Panel */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
            {selectedFaculty ? (
              showPastAttendance ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-blue-800">
                      Past Attendance Records for {selectedFaculty.name}
                    </h2>
                    <button
                      onClick={() => setShowPastAttendance(false)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Back to Mark Attendance
                    </button>
                  </div>

                  {loading && pastAttendance.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                      <p className="mt-2 text-blue-600">Loading records...</p>
                    </div>
                  ) : pastAttendance.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No past attendance records found</h3>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pastAttendance.sort((a, b) => new Date(b.date) - new Date(a.date)).map((record, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-blue-800">
                              {new Date(record.date).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </h3>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setAttendanceList(record.students);
                                  setDate(record.date);
                                  setShowPastAttendance(false);
                                }}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteAttendance(record)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-2 mb-3 text-center">
                            <div className="bg-green-100 text-green-800 p-2 rounded">
                              <div className="font-bold">{getStatusCount(record, 'present')}</div>
                              <div className="text-xs">Present</div>
                            </div>
                            <div className="bg-red-100 text-red-800 p-2 rounded">
                              <div className="font-bold">{getStatusCount(record, 'absent')}</div>
                              <div className="text-xs">Absent</div>
                            </div>
                            <div className="bg-yellow-100 text-yellow-800 p-2 rounded">
                              <div className="font-bold">{getStatusCount(record, 'late')}</div>
                              <div className="text-xs">Late</div>
                            </div>
                            <div className="bg-gray-100 text-gray-800 p-2 rounded">
                              <div className="font-bold">{getStatusCount(record, 'leave')}</div>
                              <div className="text-xs">Leave</div>
                            </div>
                          </div>
                          
                          <div className="max-h-[200px] overflow-y-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {record.students.map((student, idx) => (
                                  <tr key={idx}>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{student.rollNo}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        student.status === 'present' ? 'bg-green-100 text-green-800' :
                                        student.status === 'absent' ? 'bg-red-100 text-red-800' :
                                        student.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                      }`}>
                                        {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-blue-800">
                      Marking Attendance for {selectedFaculty.name}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border border-gray-300 px-3 py-1 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => setShowPastAttendance(true)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-1 rounded-lg text-sm"
                      >
                        View Past Records
                      </button>
                    </div>
                  </div>

                  {/* Roll Number Input */}
                  <form onSubmit={handleRollNoSubmit} className="mb-6">
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Enter Student Roll No"
                        value={rollNo}
                        onChange={(e) => setRollNo(e.target.value)}
                        className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                        disabled={loading}
                      />
                      <button
                        type="submit"
                        disabled={loading || !rollNo}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {loading ? 'Adding...' : 'Add'}
                      </button>
                    </div>
                  </form>

                  {/* Attendance List Controls */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex space-x-2">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 px-3 py-1 rounded-lg text-sm"
                      >
                        <option value="all">All Status</option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                        <option value="leave">Leave</option>
                      </select>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 px-3 py-1 rounded-lg text-sm pl-8"
                      />
                      <svg className="w-4 h-4 absolute left-2.5 top-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>
                  </div>

                  {/* Attendance List */}
                  {attendanceList.length > 0 ? (
                    <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto">
                      {filteredAttendanceList.map((student) => (
                        <div key={student.rollNo} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {student.name} (Roll No: {student.rollNo})
                              </h3>
                              <p className="text-sm text-gray-600">
                                {student.studentClass} • {student.fatherName}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <select
                                value={student.status}
                                onChange={(e) => updateAttendanceStatus(student.rollNo, e.target.value)}
                                className="border border-gray-300 px-2 py-1 rounded text-sm bg-white"
                              >
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                                <option value="late">Late</option>
                                <option value="leave">Leave</option>
                              </select>
                              <button
                                onClick={() => setAttendanceList(prev => prev.filter(s => s.rollNo !== student.rollNo))}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No students added yet</h3>
                      <p className="mt-1 text-sm text-gray-500">Enter student roll numbers to begin marking attendance.</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={submitAttendance}
                      disabled={loading || attendanceList.length === 0}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span>Submit Attendance</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )
            ) : (
              <div className="text-center py-10">
                <svg className="w-16 h-16 mx-auto text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">Select a faculty member</h3>
                <p className="mt-1 text-sm text-gray-500">Choose a faculty member from the list to begin marking attendance.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarAttendence;