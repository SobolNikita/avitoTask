import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 mb-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link
              to="/list"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                location.pathname === '/list'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              📋 Список объявлений
            </Link>
            <Link
              to="/stats"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                location.pathname === '/stats'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              📊 Статистика
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

