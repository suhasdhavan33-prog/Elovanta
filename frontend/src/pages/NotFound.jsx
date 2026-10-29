import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="page-container not-found">
    <h1>404</h1>
    <p>Oops! This page wandered off.</p>
    <Link to="/" className="btn-primary">
      Go Home
    </Link>
  </div>
);

export default NotFound;
