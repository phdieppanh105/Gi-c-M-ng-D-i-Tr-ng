import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { compressImage, playDreamyChime } from '../lib/utils';
import { X, User, Upload, Check, Smile, Shield } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
}

const DREAMY_AVATARS = [
  '🌙', '✨', '🌸', '🐰', '🐱', '🦋', '☁️', '🔮', '🧸', '🍓', '🎀', '⭐'
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
}) => {
  const { user, profile, isAdmin, saveUserProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nickname, setNickname] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user) {
      setNickname(profile?.nickname || user.displayName || '');
      setPhotoURL(profile?.photoURL || user.photoURL || '');
    }
    setSuccessMsg('');
  }, [user, profile, isOpen]);

  if (!isOpen || !user) return null;

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      setUploadingImage(true);
      const compressed = await compressImage(files[0], 400, 400, 0.85);
      setPhotoURL(compressed);
      if (soundEnabled) playDreamyChime('sparkle');
    } catch (err) {
      console.error('Error compressing avatar:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSelectEmojiAvatar = (emoji: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#fce4ec';
      ctx.fillRect(0, 0, 120, 120);
      ctx.font = '70px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, 60, 65);
      setPhotoURL(canvas.toDataURL('image/png'));
      if (soundEnabled) playDreamyChime('sparkle');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (soundEnabled) playDreamyChime('sparkle');
      await saveUserProfile(nickname, photoURL);
      setSuccessMsg('Đã cập nhật hồ sơ thành công!');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 text-[#5d6d7e]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-[32px] p-6 border border-[#e1f5fe] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#e1f5fe] mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#fce4ec] text-[#880e4f] flex items-center justify-center">
                <Smile className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#4a5568]">
                  Hồ Sơ Của Bạn
                </h3>
                <span className="text-[11px] text-[#90a4ae]">
                  Tùy chỉnh biệt danh và ảnh đại diện
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#b0bec5] hover:text-[#4a5568] hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {successMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            {/* Avatar Selection Area */}
            <div className="flex flex-col items-center justify-center pb-2">
              <div className="relative group mb-3">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#ffe0b2] shadow-xs bg-[#fffef0] flex items-center justify-center">
                  {photoURL ? (
                    <img
                      src={photoURL}
                      alt="Avatar"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-9 h-9 text-[#b0bec5]" />
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleAvatarFile}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#fce4ec] text-[#880e4f] shadow-xs hover:bg-[#f8bbd0] transition-all cursor-pointer"
                  title="Tải ảnh từ máy"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
              </div>

              <span className="text-[11px] text-[#90a4ae] mb-2">
                {uploadingImage ? 'Đang nén ảnh...' : 'Chạm nút để tải ảnh từ thiết bị'}
              </span>

              {/* Quick Dreamy Avatars */}
              <div className="flex flex-wrap justify-center gap-1.5 max-w-xs">
                {DREAMY_AVATARS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleSelectEmojiAvatar(emoji)}
                    className="w-7 h-7 rounded-lg bg-[#fcf3ff] hover:bg-[#fce4ec] flex items-center justify-center text-sm transition-transform hover:scale-110 cursor-pointer shadow-2xs border border-[#e1f5fe]"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Biệt Danh (Nickname) Input */}
            <div>
              <label className="block text-xs font-bold text-[#4a5568] mb-1 flex items-center justify-between">
                <span>Biệt Danh Hiển Thị</span>
                <span className="text-[10px] text-[#880e4f] font-normal">Ưu tiên khi bình luận</span>
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Nhập biệt danh của bạn..."
                maxLength={40}
                className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#e1f5fe] text-xs sm:text-sm text-[#4a5568] placeholder-[#b0bec5] focus:outline-hidden focus:border-[#ffe0b2] focus:ring-2 focus:ring-[#ffe0b2]/30 transition-all"
              />
            </div>

            {/* Email info */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-[#e1f5fe] flex items-center justify-between text-xs">
              <span className="text-[#90a4ae]">Tài khoản Google:</span>
              <span className="font-semibold text-[#4a5568] truncate max-w-[200px]">
                {user.email}
              </span>
            </div>

            {isAdmin && (
              <div className="p-2.5 bg-[#fff3e0] rounded-xl border border-[#ffe0b2] text-[11px] text-[#e65100] font-semibold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#fb8c00]" />
                <span>Bạn đang đăng nhập với quyền Quản Trị Viên (Moon)</span>
              </div>
            )}

            {/* Save Actions */}
            <div className="pt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-[#5d6d7e] text-xs font-bold transition-colors cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="submit"
                disabled={saving || uploadingImage}
                className="px-5 py-2 rounded-full bg-[#fce4ec] hover:bg-[#f8bbd0] text-[#880e4f] text-xs font-bold shadow-xs hover:shadow-md disabled:opacity-50 transition-all cursor-pointer"
              >
                {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
