import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Character } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  character: Character | null;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  character,
  onConfirm,
  onCancel,
  deleting,
}) => {
  if (!isOpen || !character) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-white rounded-[32px] p-6 border border-[#e1f5fe] shadow-2xl overflow-hidden text-center"
        >
          <div className="w-14 h-14 rounded-full bg-rose-100/80 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <h3 className="text-base sm:text-lg font-bold text-[#4a5568] mb-2">
            Xác Nhận Xóa Nhân Vật
          </h3>

          <p className="text-xs sm:text-sm font-semibold text-rose-600 mb-2">
            &ldquo;{character.name}&rdquo;
          </p>

          {/* Exact required warning text */}
          <div className="p-3.5 bg-rose-50/80 rounded-2xl border border-rose-100 mb-6">
            <p className="text-xs text-rose-800 leading-relaxed font-medium">
              Bạn có chắc chắn muốn xóa nhân vật này không? Hành động này không thể hoàn tác.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onCancel}
              disabled={deleting}
              className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#5d6d7e] text-xs font-bold transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              onClick={onConfirm}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>{deleting ? 'Đang xóa...' : 'XÓA NHÂN VẬT'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
