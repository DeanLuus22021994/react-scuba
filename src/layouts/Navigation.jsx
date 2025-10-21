import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Courses', path: '/courses' },
  { name: 'About', path: '/about' },
  { name: 'Gallery', path: '/gallery' },
];

const Navigation = ({ mobile = false, closeMenu }) => {
  const location = useLocation();

  const linkClass = (path) => {
    const isActive = location.pathname === path;
    const baseClass = mobile
      ? 'block px-3 py-2 text-base font-medium'
      : 'px-3 py-2 text-sm font-medium';

    return `${baseClass} ${
      isActive ? 'text-ocean-600' : 'text-gray-700 hover:text-ocean-600'
    } transition-colors duration-200`;
  };

  const handleClick = () => {
    if (mobile && closeMenu) {
      closeMenu();
    }
  };

  return (
    <nav className={mobile ? 'space-y-1' : 'flex space-x-1'}>
      {navItems.map((link) => (
        <Link key={link.path} to={link.path} className={linkClass(link.path)} onClick={handleClick}>
          {link.name}
        </Link>
      ))}
    </nav>
  );
};

Navigation.propTypes = {
  mobile: PropTypes.bool,
  closeMenu: PropTypes.func,
};

export default Navigation;
