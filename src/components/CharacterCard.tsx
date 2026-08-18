import React from 'react';
import { motion } from 'motion/react';
import { Character } from '../types';
import { Sparkles, Edit3, Trash2, ArrowUpRight, BookOpen, MessageCircle } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  onSelect: (character: Character) => void;
  onEdit?: (character: Character) => void;
  onDelete?: (character: Character) => void;
  isAdmin: boolean;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onSelect,
  onEdit,
  onDelete,
  isAdmin,
}) => {
  const hashtagsList = character.hashtags
    ? character.hashtags.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col h-full bg-white/80 backdrop-blur-md rounded-[32px] border border-[#e1f5fe] shadow-md hover:shadow-lg hover:border-[#ffe0b2] transition-all overflow-hidden"
    >
      {/* Top Media Container */}
      <div 
        onClick={() => onSelect(character)}
        className="relative w-full aspect-4/3 overflow-hidden cursor-pointer bg-gradient-to-br from-[#e0f4ff]/50 via-[#fcf3ff]/50 to-[#fffef0]/50"
      >
        {character.image ? (
          <img
            src={character.image}
            alt={character.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#b0bec5]">
            <span className="text-4xl mb-2 text-[#fb8c00]">☾</span>
            <span className="text-xs font-semibold text-[#90a4ae]">Giấc Mộng Dưới Trăng</span>
          </div>
        )}

        {/* Soft overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Explore Pill Button */}
        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#4a5568] text-[11px] font-bold flex items-center gap-1 shadow-xs group-hover:bg-[#ffe0b2] group-hover:text-[#880e4f] transition-colors">
          <BookOpen className="w-3 h-3" />
          <span>Khám phá</span>
          <ArrowUpRight className="w-3 h-3" />
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(character);
              }}
              title="Chỉnh sửa nhân vật"
              className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-[#5d6d7e] hover:bg-[#ffe0b2] hover:text-[#e65100] transition-all shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(character);
              }}
              title="Xóa nhân vật"
              className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-rose-600 hover:bg-rose-500 hover:text-white transition-all shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div 
        onClick={() => onSelect(character)}
        className="flex-1 p-5 sm:p-6 flex flex-col justify-between cursor-pointer select-none"
      >
        <div>
          {/* Character Name */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#ffb74d] shrink-0" />
            <h3 className="text-base sm:text-lg font-bold text-[#4a5568] group-hover:text-[#ff8a65] transition-colors line-clamp-1">
              {character.name}
            </h3>
          </div>

          {/* Slogan */}
          {character.slogan && (
            <p className="text-xs sm:text-sm italic font-serif text-[#90a4ae] line-clamp-2 mb-3">
              “{character.slogan}”
            </p>
          )}
        </div>

        {/* Hashtags & Footer */}
        <div className="mt-2 pt-3 border-t border-[#e1f5fe]">
          {hashtagsList.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {hashtagsList.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#fce4ec]/70 text-[#880e4f] border border-[#f8bbd0]/40"
                >
                  #{tag}
                </span>
              ))}
              {hashtagsList.length > 3 && (
                <span className="text-[10px] text-[#b0bec5] self-center">
                  +{hashtagsList.length - 3}
                </span>
              )}
            </div>
          ) : (
            <span className="text-[11px] text-[#b0bec5] flex items-center gap-1">
              <MessageCircle className="w-3 h-3 text-[#f48fb1]" />
              Chạm để đọc cốt truyện
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
