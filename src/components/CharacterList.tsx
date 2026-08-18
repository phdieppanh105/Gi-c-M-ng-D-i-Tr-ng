import React from 'react';
import { Character } from '../types';
import { CharacterCard } from './CharacterCard';
import { PlusCircle, SearchX } from 'lucide-react';

interface CharacterListProps {
  characters: Character[];
  loading: boolean;
  searchQuery: string;
  selectedTag: string | null;
  onSelectCharacter: (character: Character) => void;
  onEditCharacter: (character: Character) => void;
  onDeleteCharacter: (character: Character) => void;
  onAddNew: () => void;
  isAdmin: boolean;
}

export const CharacterList: React.FC<CharacterListProps> = ({
  characters,
  loading,
  searchQuery,
  selectedTag,
  onSelectCharacter,
  onEditCharacter,
  onDeleteCharacter,
  onAddNew,
  isAdmin,
}) => {
  // Filter characters based on search query & selected tag
  const filteredCharacters = characters.filter((char) => {
    const matchesSearch = searchQuery.trim() === '' || 
      char.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      (char.slogan && char.slogan.toLowerCase().includes(searchQuery.toLowerCase().trim())) ||
      (char.hashtags && char.hashtags.toLowerCase().includes(searchQuery.toLowerCase().trim()));

    const matchesTag = !selectedTag || 
      (char.hashtags && char.hashtags.toLowerCase().includes(selectedTag.toLowerCase()));

    return matchesSearch && matchesTag;
  });

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 rounded-full border-3 border-[#ffe0b2] border-t-[#fb8c00] animate-spin mb-4" />
        <p className="text-sm font-semibold text-[#90a4ae]">
          Đang đón ánh trăng và tải dữ liệu nhân vật...
        </p>
      </div>
    );
  }

  // Pure Empty State matching Natural Tones Design Pattern
  if (characters.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        <div className="w-full flex flex-col items-center justify-center py-16 sm:py-20 border-2 border-dashed border-[#d1d9e6] rounded-[40px] bg-white/30 backdrop-blur-sm text-center px-6">
          {/* Natural Tones Sun/Moon Celestial SVG Graphic */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 mb-6 opacity-30">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M12 3V4M12 20V21M4 12H3M21 12H20M18.364 5.636L17.6569 6.34315M6.34315 17.6569L5.63604 18.364M18.364 18.364L17.6569 17.6569M6.34315 6.34315L5.63604 5.636M12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8Z" stroke="#4a5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <p className="text-[#90a4ae] text-base sm:text-lg font-medium">
            Chưa có nhân vật nào được thêm vào đây.
          </p>
          <p className="text-[#b0bec5] text-xs sm:text-sm mt-2 max-w-sm">
            Hãy kiên nhẫn chờ đợi những câu chuyện mộng mơ sắp tới nhé!
          </p>

          {isAdmin && (
            <button
              onClick={onAddNew}
              className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#fce4ec] text-[#880e4f] text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md hover:bg-[#f8bbd0] transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>＋ Thêm Nhân Vật Đầu Tiên</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Empty state when search query returns no matches
  if (filteredCharacters.length === 0) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-white/60 border border-[#e1f5fe] flex items-center justify-center mx-auto mb-3 text-[#90a4ae]">
          <SearchX className="w-7 h-7" />
        </div>
        <h4 className="text-base font-bold text-[#4a5568] mb-1">
          Không tìm thấy nhân vật phù hợp
        </h4>
        <p className="text-xs text-[#90a4ae] max-w-sm mx-auto">
          Không tìm thấy nhân vật nào khớp với từ khóa &ldquo;{searchQuery}&rdquo;. Hãy thử tìm kiếm với tên hoặc từ khóa khác nhé!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ffe0b2]" />
          <h2 className="text-sm sm:text-base font-bold text-[#4a5568] uppercase tracking-wide">
            Danh Sách Nhân Vật
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-white/80 border border-[#e1f5fe] text-[#5d6d7e] text-xs font-semibold">
            {filteredCharacters.length}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCharacters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            onSelect={onSelectCharacter}
            onEdit={onEditCharacter}
            onDelete={onDeleteCharacter}
            isAdmin={isAdmin}
          />
        ))}
      </div>
    </div>
  );
};
