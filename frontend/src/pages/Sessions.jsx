import { useState, useEffect } from 'react';
import { createSession, getSessions, closeSession } from '../api/sessionApi';
import Navbar from '../components/Navbar';
import { pageStyle, cardStyle, inputStyle, buttonStyle, buttonSecondaryStyle, tableStyle, thStyle, tdStyle, colors } from '../utils/styles';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [form, setForm] = useState({
    courseCode: '', courseTitle: '', lecturer: '', level: '', startTime: '', endTime: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchSessions(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createSession(form);
      setForm({ courseCode: '', courseTitle: '', lecturer: '', level: '', startTime: '', endTime: '' });
      fetchSessions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async (id) => {
    try {
      await closeSession(id);
      fetchSessions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={pageStyle}>
      <Navbar />
      <div className="page-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '4px' }}>Attendance Sessions</h1>
        <p style={{ color: colors.textMuted, marginBottom: '24px' }}>Open and manage attendance windows for each course.</p>

        <div style={cardStyle}>
          {error && <div style={{ color: colors.danger, marginBottom: '12px', fontSize: '14px' }}>{error}</div>}

          <form onSubmit={handleSubmit} className="form-grid">
            <input style={inputStyle} name="courseCode" placeholder="Course Code (e.g. CEN564)" value={form.courseCode} onChange={handleChange} required />
            <input style={inputStyle} name="courseTitle" placeholder="Course Title" value={form.courseTitle} onChange={handleChange} />
            <input style={inputStyle} name="lecturer" placeholder="Lecturer" value={form.lecturer} onChange={handleChange} required />
            <input style={inputStyle} name="level" placeholder="Level (e.g. 500L)" value={form.level} onChange={handleChange} required />

            <div>
              <label style={{ fontSize: '13px', color: colors.textMuted, display: 'block', marginBottom: '6px' }}>Start Time</label>
              <input style={{ ...inputStyle, width: '100%' }} name="startTime" type="datetime-local" value={form.startTime} onChange={handleChange} required />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: colors.textMuted, display: 'block', marginBottom: '6px' }}>End Time</label>
              <input style={{ ...inputStyle, width: '100%' }} name="endTime" type="datetime-local" value={form.endTime} onChange={handleChange} required />
            </div>

            <button style={{ ...buttonStyle, gridColumn: '1 / -1' }} type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Open Session'}
            </button>
          </form>
        </div>

        <div className="table-wrapper">
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Course</th>
                <th style={thStyle}>Lecturer</th>
                <th style={thStyle}>Level</th>
                <th style={thStyle}>Start</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s._id}>
                  <td style={tdStyle}>{s.courseCode}</td>
                  <td style={tdStyle}>{s.lecturer}</td>
                  <td style={tdStyle}>{s.level}</td>
                  <td style={tdStyle}>{new Date(s.startTime).toLocaleString()}</td>
                  <td style={tdStyle}>
                    <span style={{ color: s.status === 'open' ? colors.success : colors.textMuted }}>
                      ● {s.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {s.status === 'open' && (
                      <button style={buttonSecondaryStyle} onClick={() => handleClose(s._id)}>Close</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Sessions;