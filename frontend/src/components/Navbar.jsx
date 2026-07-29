import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { colors } from '../utils/styles';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/students', label: 'Students' },
  { to: '/sessions', label: 'Sessions' },
  { to: '/enrollment', label: 'Iris Enrollment' },
  { to: '/verification', label: 'Verify Attendance' },
  { to: '/report', label: 'Attendance Report' },
];

const Navbar = () => {
  const { admin, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="navbar" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 24px',
      background: colors.surface,
      borderBottom: `1px solid ${colors.border}`,
    }}>
      <div className="navbar-links" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <strong style={{ color: colors.primary }}>Iris Attendance</strong>
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              color: location.pathname === link.to ? colors.text : colors.textMuted,
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: location.pathname === link.to ? 600 : 400,
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="navbar-user" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: colors.textMuted, fontSize: '13px' }}>
          {admin?.name} ({admin?.role})
        </span>
        <button
          onClick={logout}
          style={{
            background: 'transparent',
            border: `1px solid ${colors.border}`,
            color: colors.text,
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;