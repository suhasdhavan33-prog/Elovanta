import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <Logo size={38} />
      </Link>
      <div className="navbar-links">
        <Link to="/courses">Courses</Link>
        {(user?.role === 'student' || user?.role === 'parent') && (
          <Link to="/dashboard">My Progress</Link>
        )}
        {(user?.role === 'student' || user?.role === 'tutor') && (
          <Link to="/sessions">Live Classes</Link>
        )}
        {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
        {!user && <Link to="/login">Login</Link>}
        {!user && (
          <Link to="/register" className="btn-pill">
            Sign Up
          </Link>
        )}
        {user && (
          <button className="btn-pill btn-logout" onClick={handleLogout}>
            Logout ({user.name.split(' ')[0]})
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
