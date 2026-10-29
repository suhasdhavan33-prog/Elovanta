const Loading = ({ label = 'Loading...' }) => (
  <div className="page-loading">
    <div className="spinner" />
    <p>{label}</p>
  </div>
);

export default Loading;
