import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, MessageSquare, MoreVertical, Reply, Edit, Trash2, Flag, Pin, Link2 } from 'lucide-react';

export interface CommentData {
  id: number;
  content: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
    role: string;
  };
  createdAt: string;
  updatedAt?: string;
  likes: number;
  isLiked: boolean;
  isPinned: boolean;
  isFlagged: boolean;
  mentions: Array<{ id: number; name: string; }>;
  attachments: Array<{
    id: number;
    name: string;
    type: 'image' | 'file' | 'link';
    url: string;
    size?: number;
  }>;
  replies: CommentData[];
  parentId?: number;
}

export interface TaskCommentsProps {
  taskId: number;
  comments: CommentData[];
  currentUserId: number;
  variant?: 'default' | 'compact' | 'minimal';
  maxHeight?: string;
  onAddComment?: (content: string, parentId?: number) => void;
  onEditComment?: (commentId: number, content: string) => void;
  onDeleteComment?: (commentId: number) => void;
  onLikeComment?: (commentId: number) => void;
  onPinComment?: (commentId: number) => void;
  onFlagComment?: (commentId: number) => void;
  className?: string;
}

const CommentItem: React.FC<{
  comment: CommentData;
  currentUserId: number;
  variant: 'default' | 'compact' | 'minimal';
  level: number;
  onReply: (parentId: number) => void;
  onEdit: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
  onLike: (commentId: number) => void;
  onPin: (commentId: number) => void;
  onFlag: (commentId: number) => void;
}> = ({
  comment,
  currentUserId,
  variant,
  level,
  onReply,
  onEdit,
  onDelete,
  onLike,
  onPin,
  onFlag
}) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleSaveEdit = () => {
    onEdit(comment.id, editContent);
    setIsEditing(false);
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - commentDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return t('justNow');
    if (diffInMinutes < 60) return t('minutesAgo', { minutes: diffInMinutes });
    if (diffInMinutes < 1440) return t('hoursAgo', { hours: Math.floor(diffInMinutes / 60) });
    return t('daysAgo', { days: Math.floor(diffInMinutes / 1440) });
  };

  const isOwner = comment.author.id === currentUserId;
  const maxReplyLevel = 3;

  return (
    <div
      className={`${level > 0 ? 'ml-6 border-l border-gray-200 pl-4' : ''} ${
        comment.isPinned ? 'bg-blue-50 rounded-lg p-2' : ''
      }`}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className={variant === 'compact' ? 'h-6 w-6' : 'h-8 w-8'}>
          <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
          <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-medium ${variant === 'compact' ? 'text-sm' : ''}`}>
              {comment.author.name}
            </span>
            {comment.author.role && variant !== 'minimal' && (
              <Badge variant="secondary" className="text-xs">
                {comment.author.role}
              </Badge>
            )}
            {comment.isPinned && (
              <Pin className="h-3 w-3 text-blue-600" />
            )}
            <span className="text-xs text-gray-500">
              {timeAgo(comment.createdAt)}
              {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                <span className="ml-1">({t('edited')})</span>
              )}
            </span>
          </div>

          {/* Content */}
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[60px]"
                placeholder={t('writeComment')}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveEdit}>
                  {t('save')}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                >
                  {t('cancel')}
                </Button>
              </div>
            </div>
          ) : (
            <div className={`text-gray-900 ${variant === 'compact' ? 'text-sm' : ''}`}>
              {comment.content}
              {comment.mentions.length > 0 && variant !== 'minimal' && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {comment.mentions.map((mention) => (
                    <Badge key={mention.id} variant="outline" className="text-xs">
                      @{mention.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Attachments */}
          {comment.attachments.length > 0 && variant !== 'minimal' && (
            <div className="mt-2 space-y-1">
              {comment.attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center gap-2 text-sm">
                  <Link2 className="h-4 w-4 text-gray-400" />
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    {attachment.name}
                  </span>
                  {attachment.size && (
                    <span className="text-xs text-gray-500">
                      ({Math.round(attachment.size / 1024)} KB)
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 mt-2">
            <Button
              variant="ghost"
              size="sm"
              className={`h-6 px-2 ${comment.isLiked ? 'text-red-600' : 'text-gray-500'}`}
              onClick={() => onLike(comment.id)}
            >
              <Heart className={`h-3 w-3 mr-1 ${comment.isLiked ? 'fill-current' : ''}`} />
              {comment.likes > 0 && <span className="text-xs">{comment.likes}</span>}
            </Button>

            {level < maxReplyLevel && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-gray-500"
                onClick={() => onReply(comment.id)}
              >
                <Reply className="h-3 w-3 mr-1" />
                <span className="text-xs">{t('reply')}</span>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-500">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {isOwner && (
                  <>
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      {t('edit')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(comment.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('delete')}
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem onClick={() => onPin(comment.id)}>
                  <Pin className="h-4 w-4 mr-2" />
                  {comment.isPinned ? t('unpin') : t('pin')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFlag(comment.id)}>
                  <Flag className="h-4 w-4 mr-2" />
                  {comment.isFlagged ? t('unflag') : t('flag')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Replies */}
          {comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  currentUserId={currentUserId}
                  variant={variant}
                  level={level + 1}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onLike={onLike}
                  onPin={onPin}
                  onFlag={onFlag}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const TaskComments: React.FC<TaskCommentsProps> = ({
  taskId,
  comments,
  currentUserId,
  variant = 'default',
  maxHeight = '400px',
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
  onPinComment,
  onFlagComment,
  className = ''
}) => {
  const { t } = useTranslation();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmit = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const handleReplySubmit = () => {
    if (replyContent.trim() && onAddComment && replyingTo) {
      onAddComment(replyContent, replyingTo);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const handleReply = (parentId: number) => {
    setReplyingTo(parentId);
  };

  const handleEdit = (commentId: number, content: string) => {
    if (onEditComment) {
      onEditComment(commentId, content);
    }
  };

  const handleDelete = (commentId: number) => {
    if (onDeleteComment) {
      onDeleteComment(commentId);
    }
  };

  const handleLike = (commentId: number) => {
    if (onLikeComment) {
      onLikeComment(commentId);
    }
  };

  const handlePin = (commentId: number) => {
    if (onPinComment) {
      onPinComment(commentId);
    }
  };

  const handleFlag = (commentId: number) => {
    if (onFlagComment) {
      onFlagComment(commentId);
    }
  };

  const pinnedComments = comments.filter(c => c.isPinned);
  const regularComments = comments.filter(c => !c.isPinned);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Comments Count */}
      {variant !== 'minimal' && (
        <div className="flex items-center gap-2 pb-2 border-b">
          <MessageSquare className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">
            {t('comments')} ({comments.length})
          </span>
        </div>
      )}

      {/* Add Comment */}
      <div className="space-y-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={t('writeComment')}
          className={variant === 'compact' ? 'min-h-[60px] text-sm' : 'min-h-[80px]'}
        />
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!newComment.trim()}
            size={variant === 'compact' ? 'sm' : 'default'}
          >
            {t('addComment')}
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <ScrollArea className="space-y-4" style={{ maxHeight }}>
        {/* Pinned Comments */}
        {pinnedComments.length > 0 && (
          <div className="space-y-4">
            {pinnedComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
                variant={variant}
                level={0}
                onReply={handleReply}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onLike={handleLike}
                onPin={handlePin}
                onFlag={handleFlag}
              />
            ))}
            {regularComments.length > 0 && (
              <div className="border-t pt-4" />
            )}
          </div>
        )}

        {/* Regular Comments */}
        <div className="space-y-4">
          {regularComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              variant={variant}
              level={0}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onLike={handleLike}
              onPin={handlePin}
              onFlag={handleFlag}
            />
          ))}
        </div>

        {comments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>{t('noCommentsYet')}</p>
            <p className="text-sm">{t('beFirstToComment')}</p>
          </div>
        )}
      </ScrollArea>

      {/* Reply Form */}
      {replyingTo && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Reply className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">{t('replying')}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setReplyingTo(null);
                setReplyContent('');
              }}
              className="ml-auto h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
          <div className="space-y-2">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={t('writeReply')}
              className="min-h-[60px] text-sm"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleReplySubmit} disabled={!replyContent.trim()}>
                {t('reply')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setReplyingTo(null);
                  setReplyContent('');
                }}
              >
                {t('cancel')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskComments;