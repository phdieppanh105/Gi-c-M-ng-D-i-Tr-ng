import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Character } from '../types';
import { PlusCircle, Edit3, Trash2, X, ExternalLink } from 'lucide-react';
import { formatRelativeTime } from '../lib/utils';

interface AdminZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: Character[];
  onAddNew: () => void;
  onEdit: (character: Character) => void;
  onDelete: (character: Character) => void;
  onView: (character: Character) => void;
}

export const AdminZoneModal: React.FC<AdminZoneModalProps> = ({
  isOpen,
  onClose,
  characters,
  onAddNew,
  onEdit,
  onDelete,
  onView,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 text-[#5d6d7e]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl bg-white rounded-[36px] border border-[#e1f5fe] shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#e0f4ff]/70 via-[#fcf3ff]/70 to-[#fffef0]/70 border-b border-[#e1f5fe]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ffe0b2] text-[#fb8c00] flex items-center justify-center shadow-xs text-xl">
                ☾
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#4a5568] flex items-center gap-2">
                  <span>KHU VỰC CỦA MOON</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#fce4ec] text-[#880e4f] text-xs font-bold">Admin</span>
                </h2>
                <span className="text-xs text-[#90a4ae]">
                  Quản lý nội dung gamebook & hệ thống nhân vật
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#b0bec5] hover:text-[#4a5568] hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Bar */}
          <div className="px-6 py-3.5 bg-slate-50/70 border-b border-[#e1f5fe] flex items-center justify-between flex-wrap gap-2">
            <div className="text-xs font-semibold text-[#5d6d7e]">
              Tổng số nhân vật hiện có: <strong className="text-[#880e4f] font-bold">{characters.length}</strong>
            </div>

            <button
              onClick={() => {
                onClose();
                onAddNew();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#fce4ec] hover:bg-[#f8bbd0] text-[#880e4f] text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>＋ Thêm Nhân Vật Mới</span>
            </button>
          </div>

          {/* Characters List in Admin */}
          <div className="flex-1 overflow-y-auto p-6">
            {characters.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-[#fffef0] border border-[#ffe0b2] flex items-center justify-center mx-auto mb-3 text-2xl text-[#fb8c00]">
                  ☾
                </div>
                <h4 className="text-base font-bold text-[#4a5568] mb-1">
                  Danh sách hoàn toàn trống
                </h4>
                <p className="text-xs text-[#90a4ae] max-w-sm mx-auto mb-5">
                  Chưa có nhân vật nào trong cơ sở dữ liệu. Bấm nút bên dưới để tạo nhân vật đầu tiên cho website.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onAddNew();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#fce4ec] text-[#880e4f] hover:bg-[#f8bbd0] text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>＋ Thêm Nhân Vật Đầu Tiên</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {characters.map((char) => (
                  <div
                    key={char.id}
                    className="p-3.5 bg-white rounded-2xl border border-[#e1f5fe] shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div 
                      onClick={() => {
                        onClose();
                        onView(char);
                      }}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#e0f4ff]/50 shrink-0 border border-[#e1f5fe]">
                        {char.image ? (
                          <img
                            src={char.image}
                            alt={char.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#fb8c00] font-bold">
                            ☾
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-[#4a5568] group-hover:text-[#ff8a65] transition-colors">
                          {char.name}
                        </h4>
                        {char.slogan && (
                          <p className="text-xs text-[#90a4ae] italic line-clamp-1 font-serif">
                            “{char.slogan}”
                          </p>
                        )}
                        <span className="text-[10px] text-[#b0bec5] block mt-0.5">
                          Tạo lúc: {formatRelativeTime(char.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Quick Admin Actions */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        onClick={() => {
                          onClose();
                          onView(char);
                        }}
                        className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#4a5568] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Xem trang nhân vật"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Xem</span>
                      </button>

                      <button
                        onClick={() => {
                          onClose();
                          onEdit(char);
                        }}
                        className="px-3 py-1.5 rounded-full bg-[#fff3e0] hover:bg-[#ffe0b2] text-[#e65100] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Chỉnh sửa nhân vật"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Sửa</span>
                      </button>

                      <button
                        onClick={() => {
                          onDelete(char);
                        }}
                        className="px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Xóa nhân vật"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
