import { useState, useEffect } from 'react';
import { createStudent, getStudents, deleteStudent } from '../api/studentApi';
import StudentTable from '../components/StudentTable';
import Navbar from '../components/Navbar';
import { pageStyle, cardStyle, inputStyle, buttonStyle, colors } from '../utils/styles';

const StudentRegistration = () => {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    fullName: '', matricNumber: '', department: '', level: '', email: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createStudent(form);
      setForm({ fullName: '', matricNumber: '', department: '', level: '', email: '' });
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create student');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await deleteStudent(id);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={pageStyle}>
      <Navbar />
      <div className="page-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '4px' }}>Student Registration</h1>
        <p style={{ color: colors.textMuted, marginBottom: '24px' }}>Register new students and manage existing records.</p>

        <div style={cardStyle}>
          {error && <div style={{ color: colors.danger, marginBottom: '12px', fontSize: '14px' }}>{error}</div>}

          <form onSubmit={handleSubmit} className="form-grid">
            <input style={inputStyle} name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
            <input style={inputStyle} name="matricNumber" placeholder="Matric Number" value={form.matricNumber} onChange={handleChange} required />
            <input style={inputStyle} name="department" placeholder="Department" value={form.department} onChange={handleChange} required />
            <input style={inputStyle} name="level" placeholder="Level (e.g. 400L)" value={form.level} onChange={handleChange} required />
            <input style={{ ...inputStyle, gridColumn: '1 / -1' }} name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <button style={{ ...buttonStyle, gridColumn: '1 / -1' }} type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register Student'}
            </button>
          </form>
        </div>

        <StudentTable students={students} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default StudentRegistration;