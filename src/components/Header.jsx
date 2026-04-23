import { Stethoscope, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';

export default function Header() {
  const currentUser = useAppStore((s) => s.currentUser);
  const logout = useAppStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-navy text-offwhite px-6 py-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <Stethoscope className="w-8 h-8 text-cyan" />
        <span className="text-2xl font-bold tracking-tight">
          Kast<span className="text-cyan">Hunt</span>
        </span>
      </div>

      {currentUser && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-offwhite/80">
            Dr. {currentUser.name}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-offwhite/60 hover:text-danger transition-colors"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
