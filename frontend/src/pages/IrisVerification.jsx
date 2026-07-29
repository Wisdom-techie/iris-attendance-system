import { useState, useEffect } from 'react';
import { getSessions } from '../api/sessionApi';
import { getStudents } from '../api/studentApi';
import { verifyAttendance } from '../api/attendanceApi';
import CameraCapture from '../components/CameraCapture';
import Navbar from '../components/Navbar';
import { pageStyle, cardStyle, inputStyle, buttonStyle, colors } from '../utils/styles';

const IrisVerification = () => {
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [capturedBlob, setCapturedBlob] = useState(null);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [sessionData, studentData] = await Promise.all([getSessions(), getStudents()]);
      setSessions(sessionData.filter((s) => s.status === 'open'));
      setStudents(studentData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleVerify = async () => {
    setError('');
    setResult(null);

    if (!selectedSessionId) {
      setError('Please select a session.');
      return;
    }
    if (!selectedStudentId) {
      setError('Please select the student marking attendance.');
      return;
    }
    if (!capturedBlob) {
      setError('Please capture an iris image first.');
      return;
    }

    setLoading(true);
    try {
      const data = await verifyAttendance(selectedStudentId, selectedSessionId, capturedBlob);
      setResult(data);
      setCapturedBlob(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <Navbar />
      <div className="page-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '4px' }}>Iris Verification</h1>
        <p style={{ color: colors.textMuted, marginBottom: '24px' }}>
          Verify a student's identity via iris capture to record attendance.
        </p>

        <div style={cardStyle}>
          {error && <div style={{ color: colors.danger, fontSize: '13px', marginBottom: '12px' }}>{error}</div>}

          {result && (
            <div style={{
              background: result.matchStatus === 'matched' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${result.matchStatus === 'matched' ? colors.success : colors.danger}`,
              borderRadius: '8px',
              padding: '14px',
              marginBottom: '16px',
            }}>
              <div style={{
                color: result.matchStatus === 'matched' ? colors.success : colors.danger,
                fontWeight: 600,
                fontSize: '15px',
              }}>
                {result.matchStatus === 'matched' ? '✓ Identity Verified' : '✗ No Match'}
              </div>
              <div style={{ color: colors.textMuted, fontSize: '13px', marginTop: '4px' }}>
                Confidence: {result.matchConfidence}%
              </div>
            </div>
          )}

          <label style={{ fontSize: '13px', color: colors.textMuted, display: 'block', marginBottom: '6px' }}>
            Session
          </label>
          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            style={{ ...inputStyle, width: '100%', marginBottom: '16px' }}
          >
            <option value="">-- Select an open session --</option>
            {sessions.map((s) => (
              <option key={s._id} value={s._id}>
                {s.courseCode} — {s.lecturer}
              </option>
            ))}
          </select>

          <label style={{ fontSize: '13px', color: colors.textMuted, display: 'block', marginBottom: '6px' }}>
            Student
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            style={{ ...inputStyle, width: '100%', marginBottom: '20px' }}
          >
            <option value="">-- Select student --</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.fullName} ({s.matricNumber})
              </option>
            ))}
          </select>

          <CameraCapture onCapture={setCapturedBlob} />

          <button
            style={{ ...buttonStyle, width: '100%', marginTop: '20px' }}
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify & Mark Attendance'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IrisVerification;