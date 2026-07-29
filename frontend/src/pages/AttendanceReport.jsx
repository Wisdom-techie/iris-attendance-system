import { useState, useEffect } from 'react';
import { getSessions } from '../api/sessionApi';
import { getSessionAttendance } from '../api/attendanceApi';
import Navbar from '../components/Navbar';
import { pageStyle, cardStyle, inputStyle, tableStyle, thStyle, tdStyle, colors } from '../utils/styles';

const AttendanceReport = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchSessions(); }, []);

  const fetchRecords = async (sessionId) => {
    setError('');
    setLoading(true);
    try {
      const data = await getSessionAttendance(sessionId);
      setRecords(data);
    } catch (err) {
      setError('Failed to load attendance records.');
    } finally {
      setLoading(false);
    }
  };

  const handleSessionChange = (e) => {
    const id = e.target.value;
    setSelectedSessionId(id);
    if (id) fetchRecords(id);
    else setRecords([]);
  };

  return (
    <div style={pageStyle}>
      <Navbar />
      <div className="page-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '4px' }}>Attendance Report</h1>
        <p style={{ color: colors.textMuted, marginBottom: '24px' }}>
          View attendance records for a specific session.
        </p>

        <div style={cardStyle}>
          <label style={{ fontSize: '13px', color: colors.textMuted, display: 'block', marginBottom: '6px' }}>
            Select Session
          </label>
          <select
            value={selectedSessionId}
            onChange={handleSessionChange}
            style={{ ...inputStyle, width: '100%' }}
          >
            <option value="">-- Select a session --</option>
            {sessions.map((s) => (
              <option key={s._id} value={s._id}>
                {s.courseCode} — {s.lecturer} ({new Date(s.startTime).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        {error && <div style={{ color: colors.danger, marginTop: '16px', fontSize: '14px' }}>{error}</div>}
        {loading && <p style={{ color: colors.textMuted, marginTop: '16px' }}>Loading...</p>}

        {!loading && selectedSessionId && records.length === 0 && (
          <p style={{ color: colors.textMuted, marginTop: '16px' }}>No attendance recorded for this session yet.</p>
        )}

        {records.length > 0 && (
          <div className="table-wrapper">
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Student</th>
                  <th style={thStyle}>Matric No.</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Confidence</th>
                  <th style={thStyle}>Time</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id}>
                    <td style={tdStyle}>{r.student?.fullName}</td>
                    <td style={tdStyle}>{r.student?.matricNumber}</td>
                    <td style={tdStyle}>
                      <span style={{ color: r.matchStatus === 'matched' ? colors.success : colors.danger }}>
                        ● {r.matchStatus}
                      </span>
                    </td>
                    <td style={tdStyle}>{r.matchConfidence}%</td>
                    <td style={tdStyle}>{new Date(r.timestamp).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceReport;