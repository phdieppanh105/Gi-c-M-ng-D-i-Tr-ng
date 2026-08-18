import React, { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Comment } from '../types';
import { formatRelativeTime, playDreamyChime } from '../lib/utils';
import { 
  MessageCircle, 
  Send, 
  CornerDownRight, 
  Heart, 
  User, 
  LogIn, 
  Sparkles,
  Smile
} from 'lucide-react';

interface CommentSectionProps {
  characterId: string;
  characterName: string;
  soundEnabled: boolean;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  characterId,
  characterName,
  soundEnabled,
}) => {
  const { user, profile, login } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Subscribe to real-time comments for this character
  useEffect(() => {
    setLoading(true);
    const commentsRef = collection(db, 'comments');
    const q = query(
      commentsRef,
      where('characterId', '==', characterId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Comment[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Comment);
        });
        // Sort newest first client-side
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setComments(list);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'comments');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [characterId]);

  // Separate root comments and nested replies
  const rootComments = comments.filter((c) => !c.parentId);
  const repliesMap = comments.reduce<Record<string, Comment[]>>((acc, curr) => {
    if (curr.parentId) {
      if (!acc[curr.parentId]) acc[curr.parentId] = [];
      acc[curr.parentId].push(curr);
    }
    return acc;
  }, {});

  // Determine current display name: priority nickname -> Google displayName -> 'Bảo Bối'
  const currentDisplayName = profile?.nickname || user?.displayName || 'Bảo Bối';
  const currentPhotoURL = profile?.photoURL || user?.photoURL || '';

  const handleSendRootComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newCommentText.trim() || submitting) return;

    setSubmitting(true);
    try {
      if (soundEnabled) playDreamyChime('sparkle');
      const nowIso = new Date().toISOString();
      await addDoc(collection(db, 'comments'), {
        characterId,
        userId: user.uid,
        userName: currentDisplayName,
        userAvatar: currentPhotoURL,
        content: newCommentText.trim(),
        createdAt: nowIso,
      });
      setNewCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error);
      handleFirestoreError(error, OperationType.CREATE, 'comments');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent, parentComment: Comment) => {
    e.preventDefault();
    if (!user || !replyText.trim() || submitting) return;

    setSubmitting(true);
    try {
      if (soundEnabled) playDreamyChime('sparkle');
      const nowIso = new Date().toISOString();
      await addDoc(collection(db, 'comments'), {
        characterId,
        parentId: parentComment.id,
        userId: user.uid,
        userName: currentDisplayName,
        userAvatar: currentPhotoURL,
        content: replyText.trim(),
        createdAt: nowIso,
      });
      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error posting reply:', error);
      handleFirestoreError(error, OperationType.CREATE, 'comments');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-6 border-t border-[#e1f5fe] space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#4a5568]">
          <div className="w-7 h-7 rounded-full bg-[#fce4ec] text-[#880e4f] flex items-center justify-center">
            <MessageCircle className="w-4 h-4" />
          </div>
          <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider">
            Bình Luận ({comments.length})
          </h3>
        </div>
        <span className="text-[11px] text-[#90a4ae] flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#ffb74d]" />
          Thế giới trò chuyện dưới trăng
        </span>
      </div>

      {/* Input Box / Auth prompt */}
      {user ? (
        <form onSubmit={handleSendRootComment} className="space-y-2">
          <div className="flex gap-2.5 items-start">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#ffe0b2] shrink-0 bg-[#ffe0b2] flex items-center justify-center">
              {currentPhotoURL ? (
                <img
                  src={currentPhotoURL}
                  alt={currentDisplayName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-[#e65100]" />
              )}
            </div>

            <div className="flex-1 relative">
              <textarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder={`Chia sẻ cảm nghĩ về ${characterName}...`}
                rows={2}
                className="w-full px-4 py-2.5 bg-white/90 border border-[#e1f5fe] rounded-2xl text-xs sm:text-sm text-[#4a5568] placeholder-[#b0bec5] focus:outline-hidden focus:border-[#ffe0b2] focus:ring-2 focus:ring-[#ffe0b2]/30 transition-all resize-none shadow-2xs"
              />
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#90a4ae] pl-1">
                  Đang bình luận với tên: <strong className="text-[#880e4f]">{currentDisplayName}</strong>
                </span>
                <button
                  type="submit"
                  disabled={!newCommentText.trim() || submitting}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#fce4ec] hover:bg-[#f8bbd0] text-[#880e4f] text-xs font-bold disabled:opacity-40 transition-all cursor-pointer shadow-2xs"
                >
                  <Send className="w-3 h-3" />
                  <span>{submitting ? 'Đang gửi...' : 'Gửi'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-4 rounded-2xl bg-[#fffef0] border border-[#ffe0b2] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#ffe0b2] text-[#fb8c00] flex items-center justify-center shrink-0">
              <Smile className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#4a5568]">
                Đăng nhập để gửi bình luận và biệt danh dưới ánh trăng
              </p>
              <span className="text-[11px] text-[#90a4ae]">
                Cùng các bảo bối khác giao lưu nhé!
              </span>
            </div>
          </div>
          <button
            onClick={() => login()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#fce4ec] text-[#880e4f] hover:bg-[#f8bbd0] text-xs font-bold shadow-2xs transition-all cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng nhập Google</span>
          </button>
        </div>
      )}

      {/* Comment List */}
      {loading ? (
        <div className="py-6 text-center text-xs text-[#90a4ae]">
          Đang tải bình luận...
        </div>
      ) : rootComments.length === 0 ? (
        <div className="py-8 text-center bg-white/40 rounded-2xl border border-dashed border-[#d1d9e6]">
          <Heart className="w-6 h-6 text-[#f48fb1] mx-auto mb-1.5 opacity-60" />
          <p className="text-xs text-[#90a4ae]">
            Chưa có bình luận nào. Hãy là người đầu tiên để lại lời nhắn yêu thương nhé!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {rootComments.map((comment) => {
            const replies = repliesMap[comment.id] || [];
            const isReplying = replyingTo?.id === comment.id;

            return (
              <div
                key={comment.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-white/80 border border-[#e1f5fe] shadow-2xs space-y-3"
              >
                {/* Main Comment */}
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-[#ffe0b2] border border-[#ffe0b2] shrink-0 flex items-center justify-center">
                    {comment.userAvatar ? (
                      <img
                        src={comment.userAvatar}
                        alt={comment.userName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-[#e65100]">
                        {comment.userName.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-[#4a5568] truncate">
                        {comment.userName}
                      </h4>
                      <span className="text-[10px] text-[#b0bec5] shrink-0">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#5d6d7e] mt-1 leading-relaxed whitespace-pre-wrap font-sans">
                      {comment.content}
                    </p>

                    {/* Reply Action */}
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        onClick={() => {
                          if (!user) {
                            login();
                          } else {
                            setReplyingTo(isReplying ? null : comment);
                            setReplyText('');
                          }
                        }}
                        className="text-[11px] font-semibold text-[#880e4f] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <CornerDownRight className="w-3 h-3" />
                        <span>Trả lời</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Reply Form */}
                {isReplying && user && (
                  <form
                    onSubmit={(e) => handleSendReply(e, comment)}
                    className="ml-8 sm:ml-10 pt-2 border-t border-[#e1f5fe] flex gap-2 items-start"
                  >
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Trả lời @${comment.userName}...`}
                      rows={1}
                      autoFocus
                      className="flex-1 px-3 py-1.5 bg-white border border-[#e1f5fe] rounded-xl text-xs text-[#4a5568] placeholder-[#b0bec5] focus:outline-hidden focus:border-[#ffe0b2] focus:ring-1 focus:ring-[#ffe0b2] resize-none"
                    />
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setReplyingTo(null)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 text-[#5d6d7e] text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={!replyText.trim() || submitting}
                        className="px-3 py-1.5 rounded-xl bg-[#fce4ec] text-[#880e4f] text-xs font-bold hover:bg-[#f8bbd0] disabled:opacity-40 cursor-pointer"
                      >
                        Gửi
                      </button>
                    </div>
                  </form>
                )}

                {/* Nested Replies */}
                {replies.length > 0 && (
                  <div className="ml-6 sm:ml-10 space-y-2 pt-2 border-t border-[#e1f5fe]/80">
                    {replies.map((rep) => (
                      <div key={rep.id} className="flex gap-2.5 items-start p-2 rounded-xl bg-[#fcf3ff]/50 border border-[#e1f5fe]/60">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-[#fce4ec] border border-[#f8bbd0] shrink-0 flex items-center justify-center">
                          {rep.userAvatar ? (
                            <img
                              src={rep.userAvatar}
                              alt={rep.userName}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] font-bold text-[#880e4f]">
                              {rep.userName.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[11px] font-bold text-[#4a5568] truncate">
                              {rep.userName}
                            </span>
                            <span className="text-[9px] text-[#b0bec5] shrink-0">
                              {formatRelativeTime(rep.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-[#5d6d7e] mt-0.5 whitespace-pre-wrap">
                            {rep.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
