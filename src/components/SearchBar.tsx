import React from 'react';
import { Search, X, Sparkles } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  availableTags: string[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedTag,
  setSelectedTag,
  availableTags,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto px-4 my-6">
      {/* Search Input Box matching Natural Tones Design */}
      <div className="relative group">
        <input
          id="character-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm nhân vật của bạn..."
          className="w-full pl-6 pr-14 py-3.5 sm:py-4 bg-white/80 backdrop-blur-md border border-[#e1f5fe] rounded-full shadow-md hover:shadow-lg focus:outline-hidden focus:ring-2 focus:ring-[#ffe0b2] transition-all text-[#4a5568] placeholder-[#b0bec5] text-sm sm:text-base"
        />

        {/* Right Search Button / Clear Action */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1.5 rounded-full text-[#b0bec5] hover:text-[#5d6d7e] hover:bg-slate-100 transition-colors"
              title="Xóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#fff3e0] rounded-full flex items-center justify-center text-[#fb8c00] shadow-2xs">
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>
      </div>

      {/* Hashtag / Category Quick Chips */}
      {availableTags.length > 0 && (
        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto py-1 no-scrollbar px-1">
          <span className="text-[11px] font-semibold text-[#90a4ae] flex items-center gap-1 whitespace-nowrap pl-1">
            <Sparkles className="w-3 h-3 text-[#ffb74d]" /> Chủ đề:
          </span>
          <button
            onClick={() => setSelectedTag(null)}
            className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-all font-medium cursor-pointer ${
              selectedTag === null
                ? 'bg-[#ffe0b2] text-[#880e4f] font-semibold shadow-2xs'
                : 'bg-white/80 text-[#5d6d7e] border border-[#e1f5fe] hover:bg-[#fff9c4]/40'
            }`}
          >
            Tất cả
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-all font-medium cursor-pointer ${
                selectedTag === tag
                  ? 'bg-[#fce4ec] text-[#880e4f] font-semibold shadow-2xs'
                  : 'bg-white/80 text-[#5d6d7e] border border-[#e1f5fe] hover:bg-[#fce4ec]/40'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
