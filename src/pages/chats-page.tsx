import { useState } from "react";
import { useTranslation } from "@/hooks/use-language";
import { usePageTitle } from "@/hooks/use-title";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Search,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
} from "lucide-react";

import avatarImg from "@/assets/avatar.jpg";

interface Message {
  id: number;
  text: string;
  timestamp: string;
  isSent: boolean;
  isRead?: boolean;
}

interface Chat {
  id: number;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  messages: Message[];
}

const initialChats: Chat[] = [
  {
    id: 1,
    name: "Azizbek Matsalayev",
    avatar: avatarImg,
    lastMessage: "Hello, how are you?",
    timestamp: "12:30",
    unreadCount: 1,
    isOnline: true,
    messages: [
      { id: 1, text: "Hello!", timestamp: "12:25", isSent: false },
      { id: 2, text: "Hi there! How are you?", timestamp: "12:26", isSent: true },
      { id: 3, text: "I'm doing great, thanks!", timestamp: "12:27", isSent: false },
      { id: 4, text: "What about you?", timestamp: "12:28", isSent: false },
      { id: 5, text: "I'm good too, working on some projects", timestamp: "12:29", isSent: true },
      { id: 6, text: "Hello, how are you?", timestamp: "12:30", isSent: false, isRead: false },
    ],
  },
  {
    id: 2,
    name: "John Doe",
    lastMessage: "Let's catch up later.",
    timestamp: "11:45",
    unreadCount: 4,
    isOnline: false,
    messages: [
      { id: 1, text: "Hey, are you free today?", timestamp: "11:25", isSent: false },
      { id: 2, text: "Sorry, I'm quite busy today", timestamp: "11:26", isSent: true },
      { id: 3, text: "No worries!", timestamp: "11:28", isSent: false },
      { id: 4, text: "Let's catch up later.", timestamp: "11:45", isSent: false, isRead: false },
    ],
  },
  {
    id: 3,
    name: "Jane Smith",
    lastMessage: "Did you receive my last email?",
    timestamp: "10:20",
    unreadCount: 2,
    isOnline: true,
    messages: [
      { id: 1, text: "I sent you an important email", timestamp: "10:15", isSent: false },
      { id: 2, text: "Let me check my inbox", timestamp: "10:17", isSent: true },
      { id: 3, text: "Did you receive my last email?", timestamp: "10:20", isSent: false, isRead: false },
    ],
  },
  {
    id: 4,
    name: "Michael Johnson",
    lastMessage: "Can we reschedule our meeting?",
    timestamp: "09:15",
    unreadCount: 3,
    isOnline: false,
    messages: [
      { id: 1, text: "Good morning!", timestamp: "09:10", isSent: false },
      { id: 2, text: "Morning! What's up?", timestamp: "09:12", isSent: true },
      { id: 3, text: "Can we reschedule our meeting?", timestamp: "09:15", isSent: false, isRead: false },
    ],
  },
  {
    id: 5,
    name: "Sarah Wilson",
    lastMessage: "Thanks for the help!",
    timestamp: "Yesterday",
    unreadCount: 0,
    isOnline: true,
    messages: [
      { id: 1, text: "Could you help me with this task?", timestamp: "14:30", isSent: false },
      { id: 2, text: "Sure, what do you need?", timestamp: "14:32", isSent: true },
      { id: 3, text: "I need help with the new feature", timestamp: "14:35", isSent: false },
      { id: 4, text: "I'll help you right away", timestamp: "14:37", isSent: true },
      { id: 5, text: "Thanks for the help!", timestamp: "15:20", isSent: false, isRead: true },
    ],
  },
  {
    id: 6,
    name: "David Brown",
    lastMessage: "See you tomorrow!",
    timestamp: "Yesterday",
    unreadCount: 0,
    isOnline: false,
    messages: [
      { id: 1, text: "Are we still on for tomorrow?", timestamp: "16:45", isSent: false },
      { id: 2, text: "Yes, absolutely!", timestamp: "16:47", isSent: true },
      { id: 3, text: "Great! What time works for you?", timestamp: "16:48", isSent: false },
      { id: 4, text: "How about 10 AM?", timestamp: "16:50", isSent: true },
      { id: 5, text: "Perfect! See you tomorrow!", timestamp: "16:51", isSent: false, isRead: true },
    ],
  },
  {
    id: 7,
    name: "Emma Davis",
    lastMessage: "Great work on the project!",
    timestamp: "2 days ago",
    unreadCount: 0,
    isOnline: true,
    messages: [
      { id: 1, text: "I reviewed your latest work", timestamp: "13:20", isSent: false },
      { id: 2, text: "Thanks! How does it look?", timestamp: "13:25", isSent: true },
      { id: 3, text: "Great work on the project!", timestamp: "13:30", isSent: false, isRead: true },
    ],
  },
  {
    id: 8,
    name: "Alex Thompson",
    lastMessage: "Let's discuss this in detail",
    timestamp: "3 days ago",
    unreadCount: 0,
    isOnline: false,
    messages: [
      { id: 1, text: "I have some questions about the requirements", timestamp: "11:15", isSent: false },
      { id: 2, text: "Sure, what would you like to know?", timestamp: "11:18", isSent: true },
      { id: 3, text: "Let's discuss this in detail", timestamp: "11:20", isSent: false, isRead: true },
    ],
  },
];

export default function TelegramChatPage() {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const isMobile = useIsMobile();
  const t = useTranslation();
  usePageTitle(t("chats"));

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    // Mark messages as read when opening chat
    const updatedChats = chats.map((c) =>
      c.id === chat.id ? { ...c, unreadCount: 0 } : c
    );
    setChats(updatedChats);
  };

  const handleBackToChats = () => {
    if (isMobile) {
      setSelectedChat(null);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const newMsg: Message = {
      id: Date.now(),
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSent: true,
      isRead: false,
    };

    const updatedChats = chats.map((chat) =>
      chat.id === selectedChat.id
        ? {
            ...chat,
            messages: [...chat.messages, newMsg],
            lastMessage: newMessage,
            timestamp: newMsg.timestamp,
          }
        : chat
    );

    setChats(updatedChats);
    setSelectedChat({ ...selectedChat, messages: [...selectedChat.messages, newMsg] });
    setNewMessage("");
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full lg:border rounded-xl overflow-hidden">
      {/* Sidebar - Hidden on mobile when chat is selected */}
      <div className={`${isMobile && selectedChat ? 'hidden' : 'flex'} w-full lg:md:w-80 lg:border-r lg:bg-card flex-col`}>
        <CardHeader className="lg:pt-3.5 lg:pr-2 lg:pl-2 lg:h-16 lg:border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>

        <ScrollArea className="flex-1 overflow-hidden">
          <div className="p-2 space-y-1">
            {filteredChats.map((chat) => (
              <Card
                key={chat.id}
                onClick={() => handleChatSelect(chat)}
                className={`cursor-pointer rounded-lg p-2 transition-colors bg-accent hover:bg-muted/70 ${
                  selectedChat?.id === chat.id ? "bg-accent/80 border border-primary" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 border w-10">
                      <AvatarImage src={chat.avatar} alt={chat.name} />
                      <AvatarFallback>{chat.name[0]}</AvatarFallback>
                    </Avatar>
                    {chat.isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="truncate">{chat.name}</span>
                      <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="truncate max-w-[160px]">{chat.lastMessage}</span>
                      {chat.unreadCount > 0 && (
                        <Badge className="h-5 min-w-5 text-xs px-1">
                          {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat View - Full width on mobile when chat is selected */}
      <div className={`${isMobile && !selectedChat ? 'hidden' : 'flex'} flex-1 flex-col`}>
        {selectedChat ? (
          <>
            <CardHeader className="lg:border-b lg:h-16 lg:p-5 flex bg-card flex-row items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                {/* Back button for mobile */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden"
                  onClick={handleBackToChats}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedChat.avatar} alt={selectedChat.name} />
                    <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
                  </Avatar>
                  {selectedChat.isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-sm">{selectedChat.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {selectedChat.isOnline ? "online" : "last seen recently"}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><Video className="h-4 w-4" /></Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Mute</DropdownMenuItem>
                    <DropdownMenuItem>Block</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <ScrollArea className="flex-1 px-6 py-4 overflow-hidden">
              <div className="space-y-3">
                {selectedChat.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isSent ? "justify-end" : "justify-start"}`}>
                    <div className={`rounded-2xl px-4 py-2 text-sm max-w-xs lg:max-w-md shadow-sm ${
                      msg.isSent ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}>
                      <div>{msg.text}</div>
                      <div className="flex justify-end gap-1 mt-1 text-[11px]">
                        <span>{msg.timestamp}</span>
                        {msg.isSent && <span className={msg.isRead ? "text-blue-400" : ""}>✓✓</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t p-2 lg:px-6 lg:py-3 bg-card flex-shrink-0">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon"><Paperclip className="h-4 w-4" /></Button>
                <div className="relative flex-1">
                  <Input
                    placeholder={t("type_message")}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="pr-10"
                  />
                  <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Search className="h-10 w-10 mx-auto mb-4" />
              <p className="text-lg font-semibold">{t("select_chat")}</p>
              <p className="text-sm">{t("choose_conversation")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}