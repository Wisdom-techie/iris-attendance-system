import Navbar from '../components/Navbar';
import { pageStyle, cardStyle, colors } from '../utils/styles';

const Dashboard = () => {
  return (
    <div style={pageStyle}>
      <Navbar />
      <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '8px' }}>Welcome back</h1>
        <p style={{ color: colors.textMuted, marginBottom: '24px' }}>
          Manage students, sessions, and iris enrollment from here.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div style={cardStyle}>
            <h3>Students</h3>
            <p style={{ color: colors.textMuted, fontSize: '14px' }}>Register and manage student records.</p>
          </div>
          <div style={cardStyle}>
            <h3>Sessions</h3>
            <p style={{ color: colors.textMuted, fontSize: '14px' }}>Open attendance windows per course.</p>
          </div>
          <div style={cardStyle}>
            <h3>Iris Enrollment</h3>
            <p style={{ color: colors.textMuted, fontSize: '14px' }}>Capture and store student iris data.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;