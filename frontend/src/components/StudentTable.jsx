import { tableStyle, thStyle, tdStyle, buttonDangerStyle, colors } from '../utils/styles';

const StudentTable = ({ students, onDelete }) => {
  if (!students.length) {
    return <p style={{ color: colors.textMuted, marginTop: '20px' }}>No students registered yet.</p>;
  }

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thStyle}>Full Name</th>
          <th style={thStyle}>Matric No.</th>
          <th style={thStyle}>Department</th>
          <th style={thStyle}>Level</th>
          <th style={thStyle}>Iris Enrolled</th>
          <th style={thStyle}></th>
        </tr>
      </thead>
      <tbody>
        {students.map((s) => (
          <tr key={s._id}>
            <td style={tdStyle}>{s.fullName}</td>
            <td style={tdStyle}>{s.matricNumber}</td>
            <td style={tdStyle}>{s.department}</td>
            <td style={tdStyle}>{s.level}</td>
            <td style={tdStyle}>
              {s.irisEnrolled ? (
                <span style={{ color: colors.success }}>● Enrolled</span>
              ) : (
                <span style={{ color: colors.textMuted }}>○ Not enrolled</span>
              )}
            </td>
            <td style={tdStyle}>
              <button style={buttonDangerStyle} onClick={() => onDelete(s._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentTable;