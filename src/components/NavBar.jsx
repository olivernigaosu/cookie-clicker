import { Link, useLocation } from 'react-router-dom';
import { FaCog } from 'react-icons/fa'; // import the gear icon

export default function NavBar() {
  const location = useLocation();

  const tabs = [
    { name: 'Shop 🛒', path: '/shop' },
    { name: 'Cookie 🍪', path: '/' },
    { name: 'Stats 📊', path: '/stats' },
  ];

  return (
    <div className="flex justify-center items-center mt-6 mr-4">
      <Link
        to="/options"
        className="mr-4 p-3 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
      >
        <FaCog size={24} />
      </Link>

      {/* Main nav group */}
      <nav className="flex rounded-lg border border-gray-200 bg-white shadow-sm divide-x w-full max-w-3xl">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;

          return (
            <Link
              key={tab.name}
              to={tab.path}
              className={`flex items-center justify-center text-center flex-1 py-4 text-2xl font-medium ${
                isActive ? 'text-gray-900 font-semibold' : 'text-gray-500'
              } relative group`}
            >
              {tab.name}
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-orange-600 rounded-full"></span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
