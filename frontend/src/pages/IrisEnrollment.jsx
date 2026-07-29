import { useState, useEffect } from 'react';
import { getStudents } from '../api/studentApi';
import { enrollStudentIris } from '../api/enrollmentApi';
import CameraCapture from '../components/CameraCapture';
import Navbar from '../components/Navbar';
import { pageStyle, cardStyle, inputStyle, buttonStyle, colors } from '../utils/styles';

const IrisEnrollment = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [capturedBlob, setCapturedBlob] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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

  const handleEnroll = async () => {
    setError('');
    setSuccess('');

    if (!selectedStudentId) {
      setError('Please select a student.');
      return;
    }
    if (!capturedBlob) {
      setError('Please capture an iris image first.');
      return;
    }

    setLoading(true);
    try {
      await enrollStudentIris(selectedStudentId, capturedBlob);
      setSuccess('Iris enrollment successful.');
      setCapturedBlob(null);
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Enrollment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <Navbar />
      <div className="page-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '4px' }}>Iris Enrollment</h1>
        <p style={{ color: colors.textMuted, marginBottom: '24px' }}>
          Select a student, capture their iris image, and save it as their biometric template.
        </p>

        <div style={cardStyle}>
          {error && <div style={{ color: colors.danger, fontSize: '13px', marginBottom: '12px' }}>{error}</div>}
          {success && <div style={{ color: colors.success, fontSize: '13px', marginBottom: '12px' }}>{success}</div>}

          <label style={{ fontSize: '13px', color: colors.textMuted, display: 'block', marginBottom: '6px' }}>
            Student
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            style={{ ...inputStyle, width: '100%', marginBottom: '20px' }}
          >
            <option value="">-- Select a student --</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.fullName} ({s.matricNumber}) {s.irisEnrolled ? '— already enrolled' : ''}
              </option>
            ))}
          </select>

          <CameraCapture onCapture={setCapturedBlob} />

          <button
            style={{ ...buttonStyle, width: '100%', marginTop: '20px' }}
            onClick={handleEnroll}
            disabled={loading}
          >
            {loading ? 'Enrolling...' : 'Save Enrollment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IrisEnrollment;