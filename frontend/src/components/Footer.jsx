import Logo from './Logo';

const Footer = () => (
  <footer className="footer">
    <Logo size={22} className="footer-logo" />
    <p>© {new Date().getFullYear()} Elovanta — Friendly tutoring for ages 4 to 14.</p>
  </footer>
);

export default Footer;
