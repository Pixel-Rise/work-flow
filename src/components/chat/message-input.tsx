import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  MicOff,
  Image as ImageIcon,
  File,
  Camera,
  MapPin,
  Plus,
  X,
  Play,
  Pause,
  Square,
  Trash2,
  Upload,
  Link2,
  Hash,
  AtSign,
  Bold,
  Italic,
  Underline,
  Code,
  Quote
} from 'lucide-react';

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  status?: 'online' | 'away' | 'busy' | 'offline';
}

export interface MessageAttachment {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

export interface ReplyingTo {
  id: string;
  content: string;
  sender: ChatUser;
}

export interface MessageInputProps {
  onSendMessage: (content: string, attachments: File[], replyTo?: string) => void;
  onTyping?: (isTyping: boolean) => void;
  onFileUpload?: (files: File[]) => Promise<void>;
  replyingTo?: ReplyingTo;
  onCancelReply?: () => void;
  participants?: ChatUser[];
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  allowAttachments?: boolean;
  allowVoiceMessages?: boolean;
  allowFormatting?: boolean;
  allowMentions?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
  className?: string;
}

const EMOJIS = [
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
  '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
  '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
  '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
  '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮',
  '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓'
];

const FORMATTING_SHORTCUTS = {
  bold: { key: 'b', symbol: '**', icon: Bold },
  italic: { key: 'i', symbol: '*', icon: Italic },
  underline: { key: 'u', symbol: '__', icon: Underline },
  code: { key: '`', symbol: '`', icon: Code },
  quote: { key: '>', symbol: '> ', icon: Quote }
};

const VoiceRecorder: React.FC<{
  onRecordingComplete: (audioBlob: Blob) => void;
  onCancel: () => void;
  variant: 'default' | 'compact' | 'minimal';
}> = ({ onRecordingComplete, onCancel, variant }) => {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const chunksRef = useRef<Blob[]>([]);

  const isCompact = variant === 'compact' || variant === 'minimal';

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      chunksRef.current = [];
      setMediaRecorder(recorder);

      recorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setDuration(0);

      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    onCancel();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!isRecording) {
    return (
      <Button
        variant="ghost"
        size={isCompact ? 'sm' : 'default'}
        onClick={startRecording}
        className="h-10 w-10 p-0"
      >
        <Mic className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium text-red-700">
          {formatDuration(duration)}
        </span>
      </div>

      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={stopRecording}
          className="h-8 w-8 p-0 hover:bg-green-100"
        >
          <Square className="h-3 w-3 fill-current" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={cancelRecording}
          className="h-8 w-8 p-0 hover:bg-red-100"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

const EmojiPicker: React.FC<{
  onEmojiSelect: (emoji: string) => void;
  variant: 'default' | 'compact' | 'minimal';
}> = ({ onEmojiSelect, variant }) => {
  const isCompact = variant === 'compact' || variant === 'minimal';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size={isCompact ? 'sm' : 'default'}
          className="h-10 w-10 p-0"
        >
          <Smile className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4">
        <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto">
          {EMOJIS.map((emoji) => (
            <Button
              key={emoji}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100"
              onClick={() => onEmojiSelect(emoji)}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const AttachmentPreview: React.FC<{
  attachment: MessageAttachment;
  onRemove: () => void;
}> = ({ attachment, onRemove }) => {
  const isImage = attachment.type.startsWith('image/');

  return (
    <div className="relative bg-gray-50 rounded-lg p-2 flex items-center gap-2">
      {isImage && attachment.preview ? (
        <img
          src={attachment.preview}
          alt={attachment.name}
          className="w-10 h-10 rounded object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center">
          <File className="h-5 w-5 text-blue-600" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{attachment.name}</p>
        <p className="text-xs text-gray-500">
          {(attachment.size / 1024).toFixed(1)} KB
        </p>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-6 w-6 p-0 hover:bg-red-100"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};

const MentionsList: React.FC<{
  users: ChatUser[];
  query: string;
  onSelect: (user: ChatUser) => void;
  selectedIndex: number;
}> = ({ users, query, onSelect, selectedIndex }) => {
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(query.toLowerCase())
  );

  if (filteredUsers.length === 0) return null;

  return (
    <Card className="absolute bottom-full left-0 right-0 mb-2 max-h-48 overflow-y-auto">
      <div className="p-2">
        {filteredUsers.map((user, index) => (
          <div
            key={user.id}
            className={cn(
              'flex items-center gap-2 p-2 rounded-lg cursor-pointer',
              index === selectedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
            )}
            onClick={() => onSelect(user)}
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{user.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onTyping,
  onFileUpload,
  replyingTo,
  onCancelReply,
  participants = [],
  disabled = false,
  placeholder,
  maxLength = 2000,
  allowAttachments = true,
  allowVoiceMessages = true,
  allowFormatting = true,
  allowMentions = true,
  variant = 'default',
  className
}) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const isCompact = variant === 'compact';
  const isMinimal = variant === 'minimal';

  // Handle typing indicator
  useEffect(() => {
    if (message.length > 0 && !isTyping) {
      setIsTyping(true);
      onTyping?.(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTyping?.(false);
    }, 1000);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, isTyping, onTyping]);

  // Handle mentions
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || !allowMentions) return;

    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = message.substring(0, cursorPosition);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      setMentionStartIndex(cursorPosition - mentionMatch[0].length);
      setSelectedMentionIndex(0);
    } else {
      setMentionQuery('');
      setMentionStartIndex(-1);
    }
  }, [message, allowMentions]);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage && attachments.length === 0) return;

    const attachmentFiles = attachments.map(a => a.file);
    onSendMessage(trimmedMessage, attachmentFiles, replyingTo?.id);

    setMessage('');
    setAttachments([]);
    onCancelReply?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle mentions navigation
    if (mentionQuery && participants.length > 0) {
      const filteredUsers = participants.filter(user =>
        user.name.toLowerCase().includes(mentionQuery.toLowerCase())
      );

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedMentionIndex(prev =>
          prev > 0 ? prev - 1 : filteredUsers.length - 1
        );
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedMentionIndex(prev =>
          prev < filteredUsers.length - 1 ? prev + 1 : 0
        );
        return;
      }

      if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        if (filteredUsers[selectedMentionIndex]) {
          handleMentionSelect(filteredUsers[selectedMentionIndex]);
        }
        return;
      }
    }

    // Send message with Enter (Shift+Enter for new line)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }

    // Formatting shortcuts
    if (allowFormatting && (e.ctrlKey || e.metaKey)) {
      const shortcut = Object.entries(FORMATTING_SHORTCUTS).find(
        ([_, config]) => e.key === config.key
      );

      if (shortcut) {
        e.preventDefault();
        handleFormatting(shortcut[0] as keyof typeof FORMATTING_SHORTCUTS);
      }
    }
  };

  const handleMentionSelect = (user: ChatUser) => {
    const textarea = textareaRef.current;
    if (!textarea || mentionStartIndex === -1) return;

    const beforeMention = message.substring(0, mentionStartIndex);
    const afterMention = message.substring(textarea.selectionStart);
    const newMessage = `${beforeMention}@${user.name} ${afterMention}`;

    setMessage(newMessage);
    setMentionQuery('');
    setMentionStartIndex(-1);

    // Set cursor after the mention
    setTimeout(() => {
      const newCursorPosition = mentionStartIndex + user.name.length + 2;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      textarea.focus();
    }, 0);
  };

  const handleFormatting = (type: keyof typeof FORMATTING_SHORTCUTS) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = message.substring(start, end);
    const { symbol } = FORMATTING_SHORTCUTS[type];

    let newText;
    let newCursorPos;

    if (selectedText) {
      // Wrap selected text
      newText = message.substring(0, start) +
                symbol + selectedText + symbol +
                message.substring(end);
      newCursorPos = end + symbol.length * 2;
    } else {
      // Insert formatting symbols
      newText = message.substring(0, start) +
                symbol + symbol +
                message.substring(start);
      newCursorPos = start + symbol.length;
    }

    setMessage(newText);

    setTimeout(() => {
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const handleFileUpload = (files: File[]) => {
    const newAttachments = Array.from(files).map(file => {
      const attachment: MessageAttachment = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        type: file.type
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          attachment.preview = e.target?.result as string;
          setAttachments(prev => prev.map(a =>
            a.id === attachment.id ? attachment : a
          ));
        };
        reader.readAsDataURL(file);
      }

      return attachment;
    });

    setAttachments(prev => [...prev, ...newAttachments]);
    onFileUpload?.(files);
  };

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newMessage = message.substring(0, start) + emoji + message.substring(end);

    setMessage(newMessage);

    setTimeout(() => {
      const newCursorPos = start + emoji.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  return (
    <Card className={cn('border-0 border-t', className)}>
      <div className={cn(
        'space-y-3',
        isCompact ? 'p-3' : isMinimal ? 'p-2' : 'p-4'
      )}>
        {/* Reply preview */}
        {replyingTo && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex-1">
              <div className="text-sm font-medium text-blue-700">
                {t('replyingTo')} {replyingTo.sender.name}
              </div>
              <div className="text-sm text-blue-600 truncate">
                {replyingTo.content}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancelReply}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Attachments preview */}
        {attachments.length > 0 && (
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <AttachmentPreview
                key={attachment.id}
                attachment={attachment}
                onRemove={() => removeAttachment(attachment.id)}
              />
            ))}
          </div>
        )}

        {/* Input area */}
        <div className="relative">
          {/* Mentions list */}
          {mentionQuery && participants.length > 0 && (
            <MentionsList
              users={participants}
              query={mentionQuery}
              onSelect={handleMentionSelect}
              selectedIndex={selectedMentionIndex}
            />
          )}

          <div className="flex items-end gap-2">
            {/* Attach button */}
            {allowAttachments && !isMinimal && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size={isCompact ? 'sm' : 'default'}
                    disabled={disabled}
                    className="h-10 w-10 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <File className="h-4 w-4 mr-2" />
                    {t('attachFile')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const files = (e.target as HTMLInputElement).files;
                        if (files) handleFileUpload(Array.from(files));
                      };
                      input.click();
                    }}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    {t('attachImage')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Message input */}
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder || t('typeMessage')}
                disabled={disabled}
                maxLength={maxLength}
                className={cn(
                  'min-h-[40px] max-h-32 resize-none pr-12',
                  isCompact && 'text-sm py-2',
                  isMinimal && 'text-xs py-1'
                )}
                rows={1}
              />

              {/* Character count */}
              {message.length > maxLength * 0.8 && (
                <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                  {message.length}/{maxLength}
                </div>
              )}
            </div>

            {/* Emoji picker */}
            {!isMinimal && (
              <EmojiPicker
                onEmojiSelect={handleEmojiSelect}
                variant={variant}
              />
            )}

            {/* Voice recorder */}
            {allowVoiceMessages && !isMinimal && (
              <VoiceRecorder
                onRecordingComplete={(audioBlob) => {
                  // Handle voice message
                  const file = new File([audioBlob], 'voice-message.wav', {
                    type: 'audio/wav'
                  });
                  handleFileUpload([file]);
                }}
                onCancel={() => {}}
                variant={variant}
              />
            )}

            {/* Send button */}
            <Button
              onClick={handleSend}
              disabled={disabled || (!message.trim() && attachments.length === 0)}
              size={isCompact ? 'sm' : 'default'}
              className="h-10 w-10 p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Formatting toolbar */}
        {allowFormatting && !isMinimal && message.length > 0 && (
          <div className="flex items-center gap-1 pt-2 border-t">
            {Object.entries(FORMATTING_SHORTCUTS).map(([type, config]) => {
              const IconComponent = config.icon;
              return (
                <TooltipProvider key={type}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFormatting(type as keyof typeof FORMATTING_SHORTCUTS)}
                        className="h-8 w-8 p-0"
                      >
                        <IconComponent className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t(`formatting.${type}`)} (Ctrl+{config.key})
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = e.target.files;
          if (files) handleFileUpload(Array.from(files));
        }}
      />
    </Card>
  );
};

export default MessageInput;