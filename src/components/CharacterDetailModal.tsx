import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Character, TabType } from '../types';
import { CommentSection } from './CommentSection';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  Info, 
  MessageSquare, 
  StickyNote, 
  ExternalLink, 
  Share2, 
  Edit3, 
  Trash2, 
  HelpCircle, 
  Bot, 
  Check, 
  ArrowLeft
} from 'lucide-react';
import { playDreamyChime } from '../lib/utils';

interface CharacterDetailModalProps {
  character: Character | null;
  onClose: () => void;
  onEdit?: (character: Character) => void;
  onDelete?: (character: Character) => void;
  isAdmin: boolean;
  soundEnabled: boolean;
}

export const CharacterDetailModal: React.FC<CharacterDetailModalProps> = ({
  character,
  onClose,
  onEdit,
  onDelete,
  isAdmin,
  soundEnabled,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.INFO);
  const [copied, setCopied] = useState(false);

  if (!character) return null;

  const hashtagsList = character.hashtags
    ? character.hashtags.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean)
    : [];

  const handleShare = () => {
    if (soundEnabled) playDreamyChime('sparkle');
    const shareUrl = `${window.location.origin}${window.location.pathname}?character=${character.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      prompt('Sao chép đường dẫn nhân vật này:', shareUrl);
    });
  };

  const tabs = [
    { id: TabType.INFO, label: 'Thông Tin Nhân Vật', icon: Info },
    { id: TabType.STORY, label: 'Cốt Truyện', icon: BookOpen },
    { id: TabType.FIRST_MESSAGE, label: 'Lời Nhắn Đầu Tiên', icon: MessageSquare },
    { id: TabType.MOON_NOTE, label: 'Ghi Chú Của Moon', icon: StickyNote },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-[36px] border border-[#e1f5fe] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-[#5d6d7e]"
        >
          {/* Top Bar with Navigation & Actions */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-white/90 backdrop-blur-md border-b border-[#e1f5fe]">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100/80 hover:bg-slate-200 text-[#4a5568] text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay Lại</span>
            </button>

            <div className="flex items-center gap-2">
              {/* Share button */}
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#fce4ec] hover:bg-[#f8bbd0] text-[#880e4f] text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                title="Sao chép link chia sẻ"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã sao chép link!' : 'Chia sẻ'}</span>
              </button>

              {/* Admin Actions */}
              {isAdmin && (
                <>
                  <button
                    onClick={() => onEdit?.(character)}
                    className="p-2 rounded-full bg-[#fff3e0] hover:bg-[#ffe0b2] text-[#e65100] text-xs transition-colors"
                    title="Chỉnh sửa nhân vật"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete?.(character)}
                    className="p-2 rounded-full bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 text-xs transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-full text-[#b0bec5] hover:text-[#4a5568] hover:bg-slate-100 transition-colors"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Container */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 space-y-6">
            {/* Header Hero Profile */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Character Image */}
              <div className="w-full md:w-56 lg:w-64 shrink-0">
                <div className="relative aspect-4/5 md:aspect-3/4 rounded-3xl overflow-hidden bg-gradient-to-br from-[#e0f4ff] via-[#fcf3ff] to-[#fffef0] border border-[#e1f5fe] shadow-md">
                  {character.image ? (
                    <img
                      src={character.image}
                      alt={character.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#b0bec5]">
                      <span className="text-5xl mb-2 text-[#fb8c00]">☾</span>
                      <span className="text-xs font-semibold text-[#90a4ae]">Giấc Mộng Dưới Trăng</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
              </div>

              {/* Character Overview & Action Links */}
              <div className="flex-1 flex flex-col justify-between self-stretch">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-0.5 rounded-full bg-[#fce4ec] text-[#880e4f] text-xs font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#ff8a65]" />
                      Nhân Vật Gamebook
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold text-[#4a5568] tracking-tight mb-2">
                    {character.name}
                  </h1>

                  {character.slogan && (
                    <p className="text-sm sm:text-base italic font-serif text-[#90a4ae] mb-4 bg-[#fffef0]/80 p-3.5 rounded-2xl border border-[#ffe0b2]/60 leading-relaxed">
                      “{character.slogan}”
                    </p>
                  )}

                  {hashtagsList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {hashtagsList.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white border border-[#e1f5fe] text-[#5d6d7e] shadow-2xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Direct Required Links: Google AI Studio & NGL (Giải Đáp Thắc Mắc) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4 border-t border-[#e1f5fe]">
                  {/* Google AI Studio Link Button */}
                  {character.googleAIStudioLink ? (
                    <a
                      href={character.googleAIStudioLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#e0f4ff] hover:bg-[#b3e5fc] text-[#0277bd] text-xs sm:text-sm font-bold shadow-2xs hover:shadow-xs transition-all border border-[#b3e5fc]"
                    >
                      <Bot className="w-4 h-4 text-[#0288d1]" />
                      <span>Truy Cập GGAI STUDIO</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>
                  ) : (
                    <button
                      disabled
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 text-[#b0bec5] text-xs sm:text-sm font-medium cursor-not-allowed"
                    >
                      <Bot className="w-4 h-4" />
                      <span>GGAI STUDIO (Chưa có link)</span>
                    </button>
                  )}

                  {/* NGL Link Button */}
                  {character.nglLink ? (
                    <a
                      href={character.nglLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#fce4ec] hover:bg-[#f8bbd0] text-[#880e4f] text-xs sm:text-sm font-bold shadow-2xs hover:shadow-xs transition-all border border-[#f8bbd0]"
                    >
                      <HelpCircle className="w-4 h-4 text-[#c2185b]" />
                      <span>Giải Đáp Thắc Mắc (NGL)</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>
                  ) : (
                    <button
                      disabled
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 text-[#b0bec5] text-xs sm:text-sm font-medium cursor-not-allowed"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Giải Đáp Thắc Mắc (Chưa có link)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Tabs for Details */}
            <div className="border-b border-[#e1f5fe]">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (soundEnabled) playDreamyChime('click');
                        setActiveTab(tab.id);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#ffe0b2] text-[#880e4f] shadow-2xs'
                          : 'bg-white/80 text-[#5d6d7e] hover:bg-[#fff9c4]/30 border border-[#e1f5fe]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content Display Area */}
            <div className="bg-white/80 rounded-3xl p-5 sm:p-6 border border-[#e1f5fe] shadow-xs min-h-[160px]">
              {/* Tab 1: Thông Tin Nhân Vật */}
              {activeTab === TabType.INFO && (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-[#4a5568]">
                    <Info className="w-4 h-4 text-[#ff8a65]" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">
                      Thông Tin Nhân Vật
                    </h3>
                  </div>
                  {character.characterInfo ? (
                    <div className="text-xs sm:text-sm text-[#4a5568] leading-relaxed whitespace-pre-wrap">
                      {character.characterInfo}
                    </div>
                  ) : (
                    <p className="text-xs text-[#b0bec5] italic">Chưa có thông tin nhân vật.</p>
                  )}
                </div>
              )}

              {/* Tab 2: Cốt Truyện */}
              {activeTab === TabType.STORY && (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-[#4a5568]">
                    <BookOpen className="w-4 h-4 text-[#ff8a65]" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">
                      Cốt Truyện
                    </h3>
                  </div>
                  {character.story ? (
                    <div className="max-h-[420px] overflow-y-auto pr-2 text-xs sm:text-sm text-[#4a5568] leading-relaxed whitespace-pre-wrap space-y-3 font-serif">
                      {character.story}
                    </div>
                  ) : (
                    <p className="text-xs text-[#b0bec5] italic">Chưa có cốt truyện.</p>
                  )}
                </div>
              )}

              {/* Tab 3: Tin Nhắn Đầu Tiên */}
              {activeTab === TabType.FIRST_MESSAGE && (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-[#880e4f]">
                    <MessageSquare className="w-4 h-4 text-[#f48fb1]" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">
                      Lời Nhắn Đầu Tiên
                    </h3>
                  </div>
                  {character.firstMessage ? (
                    <div className="p-4 rounded-2xl bg-[#fce4ec]/40 border border-[#f8bbd0]/60 text-xs sm:text-sm text-[#4a5568] leading-relaxed whitespace-pre-wrap max-h-[350px] overflow-y-auto font-serif">
                      {character.firstMessage}
                    </div>
                  ) : (
                    <p className="text-xs text-[#b0bec5] italic">Chưa có lời nhắn đầu tiên.</p>
                  )}
                </div>
              )}

              {/* Tab 4: Ghi Chú Của Moon */}
              {activeTab === TabType.MOON_NOTE && (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-[#e65100]">
                    <StickyNote className="w-4 h-4 text-[#ffb74d]" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">
                      Ghi Chú Của Moon
                    </h3>
                  </div>
                  {character.moonNote ? (
                    <div className="p-4 rounded-2xl bg-[#fff3e0]/50 border border-[#ffe0b2]/70 text-xs sm:text-sm text-[#4a5568] leading-relaxed whitespace-pre-wrap max-h-[350px] overflow-y-auto">
                      {character.moonNote}
                    </div>
                  ) : (
                    <p className="text-xs text-[#b0bec5] italic">Chưa có ghi chú của Moon.</p>
                  )}
                </div>
              )}
            </div>

            {/* Embedded Live Comments Section */}
            <CommentSection
              characterId={character.id}
              characterName={character.name}
              soundEnabled={soundEnabled}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
