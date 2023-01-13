import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';


function App() {
  const [students, setStudents] = useState([]);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [updatedStudentName, setUpdatedStudentName] = useState('');
  const [updatedStudentEmail, setUpdatedStudentEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {
    async function getAllStudents() {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/student/?page=${currentPage}`);
        console.log(response.data);
        setStudents(response.data.results);
        setTotalPages(response.data.total_pages);
        setFilteredStudents(response.data.results);
      } catch (error) {
        console.log(error);
      }
    }
    getAllStudents();
  }, [currentPage]);

  const handleAddStudent = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/student/", {
        student_name: newStudentName,
        student_email: newStudentEmail
      });
      console.log(response.data);
      setStudents([...students, response.data]);
      setNewStudentName('');
      setNewStudentEmail('');
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setUpdatedStudentName(student.student_name);
    setUpdatedStudentEmail(student.student_email);
  };

  const handleUpdateStudent = async () => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/student/${editingStudent.id}/`, {
        student_name: updatedStudentName,
        student_email: updatedStudentEmail
      });
      console.log(response.data);
      setStudents(students.map(student => student.id === editingStudent.id ? response.data : student));
      setEditingStudent(null);
      setUpdatedStudentName('');
      setUpdatedStudentEmail('');
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/student/${studentId}/`);
      setStudents(students.filter(student => student.id !== studentId));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Filter students based on search term
    const filtered = students.filter(student =>
      student.student_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };


  return (
    <div className="App">
      <h1>Hello, welcome to the frontend</h1>
      <div>
        <h2>Search Students:</h2>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div>
        <h2>Add New Student:</h2>
        <form onSubmit={handleAddStudent}>
          <input
            type="text"
            placeholder="Name"
            value={newStudentName}
            onChange={(e) => setNewStudentName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={newStudentEmail}
            onChange={(e) => setNewStudentEmail(e.target.value)}
          />
          <button type="submit">Add Student</button>
        </form>
      </div>
      <div>
        <h2>Students:</h2>
        <ul>
          {filteredStudents.map(student => (
            <li key={student.id}>
              {editingStudent === student ? (
                <>
                  <input
                    type="text"
                    value={updatedStudentName}
                    onChange={(e) => setUpdatedStudentName(e.target.value)}
                  />
                  <input
                    type="email"
                    value={updatedStudentEmail}
                    onChange={(e) => setUpdatedStudentEmail(e.target.value)}
                  />
                  <button onClick={handleUpdateStudent}>Update</button>
                  <button onClick={() => setEditingStudent(null)}>Cancel</button>
                </>
              ) : (
                <>
                  {student.student_name} - {student.student_email}
                  <button onClick={() => handleEditStudent(student)}>Edit</button>
                  <button onClick={() => handleDeleteStudent(student.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      
      <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
      {[currentPage, currentPage + 1].map(page => (
          <button key={page} onClick={() => setCurrentPage(page)} disabled={page > totalPages}>{page}</button>
        ))}
      <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      
    </div>
  );
}

export default App;
