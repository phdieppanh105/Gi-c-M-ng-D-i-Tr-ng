import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut, PlusCircle, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { playDreamyChime } from '../lib/utils';

interface HeaderProps {
  onOpenAdmin: () => void;
  onOpenProfile: () => void;
  onOpenAddCharacter: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAdmin,
  onOpenProfile,
  onOpenAddCharacter,
  soundEnabled,
  setSoundEnabled,
}) => {
  const { user, profile, isAdmin, login, logout } = useAuth();

  const handleLogin = async () => {
    try {
      if (soundEnabled) playDreamyChime('sparkle');
      await login();
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleLogout = async () => {
    try {
      if (soundEnabled) playDreamyChime('click');
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/70 backdrop-blur-md border-b border-[#e1f5fe] shadow-xs transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none group" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-10 h-10 bg-[#ffe0b2] rounded-full flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
            <span className="text-xl text-[#fb8c00]">☾</span>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#4a5568] uppercase font-sans">
              Giấc Mộng Dưới Trăng
            </h1>
            <span className="text-[11px] font-medium tracking-wider text-[#90a4ae] block">
              Thế Giới Gamebook Tương Tác
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playDreamyChime('sparkle');
            }}
            title={soundEnabled ? 'Tắt âm thanh hiệu ứng' : 'Bật âm thanh huyền diệu'}
            className="w-9 h-9 rounded-full bg-white/80 border border-[#e1f5fe] text-[#90a4ae] hover:text-[#ff8a65] hover:bg-white flex items-center justify-center transition-colors shadow-2xs"
            aria-label="Sound Toggle"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#ff8a65]" /> : <VolumeX className="w-4 h-4 text-[#b0bec5]" />}
          </button>

          {/* Admin Area Quick Buttons (Visible ONLY to Admin) */}
          {isAdmin && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (soundEnabled) playDreamyChime('sparkle');
                  onOpenAddCharacter();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#fce4ec] text-[#880e4f] text-xs font-semibold shadow-xs hover:shadow-md hover:bg-[#f8bbd0] transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>＋ Thêm Nhân Vật</span>
              </button>

              <button
                onClick={() => {
                  if (soundEnabled) playDreamyChime('open');
                  onOpenAdmin();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#fff3e0] border border-[#ffe0b2] text-[#e65100] text-xs font-semibold hover:bg-[#ffe0b2] transition-all cursor-pointer shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#fb8c00]" />
                <span className="hidden md:inline">Khu Vực Của Moon</span>
                <span className="md:hidden">Moon</span>
              </button>
            </div>
          )}

          {/* User Account / Profile */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (soundEnabled) playDreamyChime('click');
                  onOpenProfile();
                }}
                className="flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full bg-white/80 border border-[#e1f5fe] hover:border-[#ffe0b2] hover:bg-[#fff9c4]/30 transition-all shadow-2xs cursor-pointer"
                title="Hồ sơ người dùng & Biệt danh"
              >
                {profile?.photoURL || user.photoURL ? (
                  <img
                    src={profile?.photoURL || user.photoURL || ''}
                    alt="Avatar"
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border border-[#ffe0b2]"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#ffe0b2] text-[#e65100] flex items-center justify-center text-xs font-bold">
                    {profile?.nickname?.charAt(0) || user.displayName?.charAt(0) || '☾'}
                  </div>
                )}
                <span className="text-xs font-semibold text-[#4a5568] max-w-[100px] truncate hidden sm:inline">
                  {profile?.nickname || user.displayName || 'Bảo bối'}
                </span>
              </button>

              <button
                onClick={handleLogout}
                title="Đăng xuất"
                className="w-9 h-9 rounded-full bg-white/80 border border-[#e1f5fe] text-[#90a4ae] hover:text-[#ff8a65] hover:bg-[#fff3e0] flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleLogin}
                className="text-sm font-medium text-[#5d6d7e] hover:text-[#ff8a65] transition-colors cursor-pointer hidden sm:inline"
              >
                Đăng nhập
              </button>
              <button
                onClick={handleLogin}
                className="inline-flex items-center gap-1.5 bg-[#fce4ec] px-5 py-2 rounded-full text-xs sm:text-sm font-semibold text-[#880e4f] shadow-xs hover:shadow-md hover:bg-[#f8bbd0] transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng nhập Google</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
