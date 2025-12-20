import { FiBell, FiMenu } from 'react-icons/fi';
import { getAuthData } from '../../utils/localStorage';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardTopbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notifications] = useState(3);

  const loadUserData = () => {
    const authData = getAuthData();
    setUser(authData);
  };

  useEffect(() => {
    loadUserData();

    // Refresh user data whenever window gains focus
    window.addEventListener('focus', loadUserData);
    return () => window.removeEventListener('focus', loadUserData);
  }, []);

  const getPhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http')) return photoPath;
    return `http://localhost:8000/${photoPath}`;
  };

  const photoUrl = user ? getPhotoUrl(user.photo) : null;
  const displayName = user?.name?.charAt(0).toUpperCase() || 'D';

  const handleAvatarClick = () => {
    if (user?.role === 'donatur') {
      navigate('/donatur/profil');
    } else if (user?.role === 'penerima') {
      navigate('/penerima/profil');
    }
  };

  return (
    <nav className="fixed top-0 right-0 left-0 lg:left-64 h-20 bg-white border-b border-gray-200 shadow-sm z-30 transition-all">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <FiMenu className="text-2xl text-gray-700" />
        </button>

        {/* Spacer for desktop */}
        <div className="flex-1 lg:hidden"></div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FiBell className="text-2xl text-gray-700" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          {/* User Info */}
          <div
            onClick={handleAvatarClick}
            className="flex items-center space-x-3 pl-4 border-l border-gray-200 cursor-pointer hover:opacity-80 transition"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#007EFF] to-[#0063FF] rounded-full flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-lg">{displayName}</span>
              )}
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-gray-900">{user?.name}</div>
              <div className="text-xs text-gray-600 capitalize">{user?.role || 'User'}</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardTopbar;