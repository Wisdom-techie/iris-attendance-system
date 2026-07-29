export const colors = {
  bg: '#0f1117',
  surface: '#1a1d27',
  surfaceLight: '#232734',
  border: '#2e323f',
  text: '#e4e6eb',
  textMuted: '#9aa0ac',
  primary: '#6366f1',
  primaryHover: '#4f52d9',
  danger: '#ef4444',
  success: '#22c55e',
};

export const inputStyle = {
  padding: '10px 12px',
  borderRadius: '8px',
  border: `1px solid ${colors.border}`,
  background: colors.surfaceLight,
  color: colors.text,
  fontSize: '14px',
  outline: 'none',
};

export const buttonStyle = {
  padding: '10px 16px',
  borderRadius: '8px',
  border: 'none',
  background: colors.primary,
  color: '#fff',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
};

export const buttonDangerStyle = {
  ...buttonStyle,
  background: 'transparent',
  border: `1px solid ${colors.danger}`,
  color: colors.danger,
  padding: '6px 12px',
  fontSize: '13px',
};

export const buttonSecondaryStyle = {
  ...buttonStyle,
  background: 'transparent',
  border: `1px solid ${colors.border}`,
  color: colors.text,
  padding: '6px 12px',
  fontSize: '13px',
};

export const cardStyle = {
  background: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: '12px',
  padding: '24px',
};

export const pageStyle = {
  minHeight: '100vh',
  background: colors.bg,
  color: colors.text,
  fontFamily: "'Inter', system-ui, sans-serif",
};

export const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
};

export const thStyle = {
  textAlign: 'left',
  padding: '10px 12px',
  borderBottom: `1px solid ${colors.border}`,
  color: colors.textMuted,
  fontSize: '13px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
};

export const tdStyle = {
  padding: '12px',
  borderBottom: `1px solid ${colors.border}`,
  fontSize: '14px',
};