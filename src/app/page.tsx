'use client'

import React, { useState, useEffect, useRef, ReactElement } from 'react';
import { 
  MessageCircle, 
  BarChart3, 
  FileText, 
  Settings, 
  Users, 
  Phone,
  Search,
  Filter,
  Menu,
  X,
  Bot,
  User,
  Send,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Bell,
  Plus,
  LucideIcon
} from 'lucide-react';

// Types
interface Conversation {
  id: string;
  customer_name: string;
  customer_platform_username: string;
  platform_name: string;
  account_name: string;
  current_handler_type: 'ai' | 'human';
  ai_enabled: boolean;
  status: string;
  priority: string;
  message_count: number;
  unread_count: number;
  last_message_preview: string;
  time_since_last_message: number;
  last_message_at: string;
}

interface Message {
  id: string;
  message_type: string;
  direction: 'inbound' | 'outbound';
  sender_type: 'customer' | 'agent' | 'ai';
  sender_name: string;
  content_encrypted: string;
  platform_timestamp: string;
  is_read_by_current_user: boolean;
  delivery_status: string;
}

interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
  count: number | null;
}

interface Stat {
  label: string;
  value: string;
  change: string;
  color: string;
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobile: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

interface TopNavProps {
  isMobile: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface ChatListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  isMobile: boolean;
}

interface ChatMessagesProps {
  selectedConversation: Conversation | null;
  messages: Message[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  sendMessage: () => void;
  toggleAIControl: () => void;
  loading: boolean;
  onBack: () => void;
  isMobile: boolean;
}

interface ChatModuleProps {
  isMobile: boolean;
}

// Constants
const BEARER_TOKEN: string = 'your-bearer-token';
const USER_ID: string = '88280a92-7ab2-45ed-96b8-cc2fbd2ee539';
const TENANT_ID: string = '49592c05-e4f6-4ae1-ba21-9e5034171ffa';

// Sidebar Component
const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isMobile, isOpen, setIsOpen }) => {
  const menuItems: MenuItem[] = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard', count: null },
    { id: 'chats', icon: MessageCircle, label: 'Chats', count: 6 },
    { id: 'calls', icon: Phone, label: 'Calls', count: null },
    { id: 'contacts', icon: Users, label: 'Contacts', count: null },
    { id: 'documents', icon: FileText, label: 'Documents', count: null },
    { id: 'settings', icon: Settings, label: 'Settings', count: null }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed' : 'relative'} 
        ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
        w-64 h-full bg-white/10 backdrop-blur-md border-r border-white/20 
        transition-transform duration-300 z-50 flex flex-col
      `}>
        {/* Header */}
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="text-white font-semibold text-lg">Korra AI</span>
            </div>
            {isMobile && (
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded text-white"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item: MenuItem) => {
              const Icon = item.icon;
              const isActive: boolean = activeTab === item.id;
              const isDisabled: boolean = item.id !== 'chats' && item.id !== 'dashboard';
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (!isDisabled) {
                      setActiveTab(item.id);
                      if (isMobile) setIsOpen(false);
                    }
                  }}
                  disabled={isDisabled}
                  className={`
                    w-full flex items-center justify-between p-3 rounded-lg transition-all
                    ${isActive 
                      ? 'bg-white/20 text-white shadow-lg' 
                      : isDisabled 
                        ? 'text-gray-500 cursor-not-allowed' 
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.count && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-5 text-center">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
              JD
            </div>
            <div>
              <div className="text-white font-medium text-sm">John Doe</div>
              <div className="text-gray-400 text-xs">Admin</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Top Navigation Component
const TopNav: React.FC<TopNavProps> = ({ isMobile, setSidebarOpen }) => {
  return (
    <div className="h-16 bg-white/5 backdrop-blur-md border-b border-white/20 flex items-center justify-between px-4">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {isMobile && (
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-white/20 rounded text-white"
          >
            <Menu size={20} />
          </button>
        )}
        
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-white">Dashboard</h1>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-white/20 rounded text-white relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
          JD
        </div>
      </div>
    </div>
  );
};

// Dashboard Content Component
const DashboardContent: React.FC = () => {
  const stats: Stat[] = [
    { label: 'Total Conversations', value: '1,234', change: '+12%', color: 'from-blue-400 to-blue-600' },
    { label: 'Active Chats', value: '89', change: '+5%', color: 'from-green-400 to-green-600' },
    { label: 'AI Responses', value: '456', change: '+23%', color: 'from-purple-400 to-purple-600' },
    { label: 'Response Time', value: '2.3s', change: '-8%', color: 'from-orange-400 to-orange-600' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Welcome back!</h2>
        <p className="text-gray-400">Here's what's happening with your conversations today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat: Stat, index: number) => (
          <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                <BarChart3 size={24} className="text-white" />
              </div>
              <span className={`text-sm px-2 py-1 rounded-full ${
                stat.change.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Conversation Volume</h3>
          <div className="h-48 flex items-center justify-center text-gray-400">
            Chart will be here
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Response Times</h3>
          <div className="h-48 flex items-center justify-center text-gray-400">
            Chart will be here
          </div>
        </div>
      </div>
    </div>
  );
};

// Chat List Component
const ChatList: React.FC<ChatListProps> = ({ conversations, selectedConversation, onSelectConversation, isMobile }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const filteredConversations: Conversation[] = conversations.filter((conv: Conversation) =>
    conv.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.last_message_preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatRelativeTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/20 bg-white/5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Conversations</h2>
          <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            <Plus size={16} className="text-white" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Filter buttons */}
        <div className="flex gap-2 mt-3">
          <button className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">All</button>
          <button className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-sm hover:bg-white/20">Unread</button>
          <button className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-sm hover:bg-white/20">AI</button>
        </div>
      </div>
      
      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation: Conversation) => (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className={`p-4 border-b border-white/10 hover:bg-white/10 cursor-pointer transition-colors ${
              selectedConversation?.id === conversation.id ? 'bg-white/20' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                    {conversation.customer_name.charAt(0)}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    conversation.current_handler_type === 'ai' ? 'bg-purple-500' : 'bg-green-500'
                  } flex items-center justify-center`}>
                    {conversation.current_handler_type === 'ai' ? 
                      <Bot size={8} className="text-white" /> : 
                      <User size={8} className="text-white" />
                    }
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{conversation.customer_name}</span>
                    <span className="text-xs text-gray-400">{conversation.platform_name}</span>
                  </div>
                  <div className="text-sm text-gray-300 truncate max-w-48">
                    {conversation.last_message_preview}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-gray-400">
                  {formatRelativeTime(conversation.time_since_last_message)}
                </span>
                {conversation.unread_count > 0 && (
                  <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-5 text-center">
                    {conversation.unread_count}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Chat Messages Component
const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  selectedConversation, 
  messages, 
  newMessage, 
  setNewMessage, 
  sendMessage, 
  toggleAIControl, 
  loading,
  onBack,
  isMobile 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderMessageContent = (content: string): ReactElement => {
    let formatted: string = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">$1</a>');
    
    return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  if (!selectedConversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
          <p>Choose a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/20 bg-white/5 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={onBack}
                className="p-1 hover:bg-white/20 rounded text-white"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
              {selectedConversation.customer_name.charAt(0)}
            </div>
            
            <div>
              <div className="font-medium text-white">{selectedConversation.customer_name}</div>
              <div className="text-sm text-gray-400 flex items-center gap-2">
                {selectedConversation.platform_name}
                {selectedConversation.current_handler_type === 'ai' ? (
                  <span className="flex items-center gap-1 text-purple-400">
                    <Bot size={14} />
                    AI Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-green-400">
                    <User size={14} />
                    Human
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <button
            onClick={toggleAIControl}
            disabled={loading}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedConversation.ai_enabled
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-gray-600 hover:bg-gray-500'
            } disabled:opacity-50 text-white`}
          >
            {selectedConversation.ai_enabled ? 'Disable AI' : 'Enable AI'}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message: Message) => {
          const isOutbound: boolean = message.direction === 'outbound';
          const isAI: boolean = message.sender_type === 'ai';
          const isUnread: boolean = !message.is_read_by_current_user && message.direction === 'inbound';
          
          return (
            <div
              key={message.id}
              className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${isMobile ? 'max-w-[90%]' : ''}`}>
                {!isOutbound && (
                  <div className="flex items-center gap-2 mb-1 text-xs text-gray-400">
                    {isAI ? <Bot size={12} /> : <User size={12} />}
                    <span>{message.sender_name}</span>
                    {isAI && <span className="text-purple-400">AI</span>}
                  </div>
                )}
                
                <div
                  className={`p-3 rounded-2xl backdrop-blur-sm ${
                    isOutbound
                      ? 'bg-blue-600/80 text-white'
                      : isAI
                      ? `bg-purple-600/60 text-white ${isUnread ? 'ring-2 ring-yellow-400' : ''}`
                      : `bg-white/20 text-white ${isUnread ? 'ring-2 ring-yellow-400' : ''}`
                  } ${isUnread ? 'shadow-lg shadow-yellow-400/20' : ''}`}
                >
                  {renderMessageContent(message.content_encrypted)}
                </div>
                
                <div className={`flex items-center gap-2 mt-1 text-xs text-gray-400 ${isOutbound ? 'justify-end' : 'justify-start'}`}>
                  <span>{formatTime(message.platform_timestamp)}</span>
                  {isOutbound && (
                    <div className="flex items-center gap-1">
                      {message.delivery_status === 'sent' ? (
                        <CheckCircle2 size={12} className="text-green-400" />
                      ) : (
                        <Circle size={12} />
                      )}
                    </div>
                  )}
                  {isUnread && (
                    <span className="text-yellow-400 font-medium">New</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      {selectedConversation.current_handler_type === 'human' ? (
        <div className="p-4 border-t border-white/20 bg-white/5 backdrop-blur-md">
          <div className="flex items-end gap-3">
            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <textarea
                value={newMessage}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full p-3 bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none"
                rows={3}
                onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={loading || !newMessage.trim()}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <Send size={20} className="text-white" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 border-t border-white/20 bg-purple-600/20 backdrop-blur-md">
          <div className="flex items-center justify-center gap-2 text-purple-300">
            <Bot size={20} />
            <span>AI is handling this conversation</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Chat Module Component
const ChatModule: React.FC<ChatModuleProps> = ({ isMobile }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showMessages, setShowMessages] = useState<boolean>(false);
  
  const wsConversations = useRef<WebSocket | null>(null);
  const wsMessages = useRef<WebSocket | null>(null);

  // WebSocket for conversations
  useEffect(() => {
    const connectConversationsWS = (): void => {
      const ws = new WebSocket(
        `wss://korraai.bitwavetechnologies.com/ws/conversations/?user_id=${USER_ID}&tenant_id=${TENANT_ID}`
      );
      
      ws.onopen = () => console.log('Conversations WebSocket connected');
      ws.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        if (data.type === 'conversation_list') {
          setConversations(data.data.results);
        }
      };
      ws.onclose = () => {
        console.log('Conversations WebSocket disconnected, reconnecting...');
        setTimeout(connectConversationsWS, 3000);
      };
      
      wsConversations.current = ws;
    };

    connectConversationsWS();
    return () => wsConversations.current?.close();
  }, []);

  // WebSocket for messages
  useEffect(() => {
    if (!selectedConversation) return;

    const connectMessagesWS = (): void => {
      const ws = new WebSocket(
        `wss://korraai.bitwavetechnologies.com/ws/conversations/${selectedConversation.id}/messages/?user_id=${USER_ID}&tenant_id=${TENANT_ID}`
      );
      
      ws.onopen = () => console.log('Messages WebSocket connected');
      ws.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        if (data.type === 'messages_list') {
          setMessages(data.data.results.reverse());
        }
      };
      ws.onclose = () => {
        console.log('Messages WebSocket disconnected, reconnecting...');
        setTimeout(connectMessagesWS, 3000);
      };
      
      wsMessages.current = ws;
    };

    connectMessagesWS();
    return () => wsMessages.current?.close();
  }, [selectedConversation]);

  const handleSelectConversation = (conversation: Conversation): void => {
    setSelectedConversation(conversation);
    if (isMobile) {
      setShowMessages(true);
    }
  };

  const handleBackToList = (): void => {
    setShowMessages(false);
    setSelectedConversation(null);
  };

  const toggleAIControl = async (): Promise<void> => {
    if (!selectedConversation) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://korraai.bitwavetechnologies.com/api/conversations/${selectedConversation.id}/ai-control/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${BEARER_TOKEN}`,
          },
          body: JSON.stringify({
            ai_enabled: !selectedConversation.ai_enabled
          }),
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setSelectedConversation(prev => prev ? {...prev, ...data.conversation} : null);
        setConversations(prev => 
          prev.map(conv => 
            conv.id === selectedConversation.id 
              ? {...conv, ...data.conversation}
              : conv
          )
        );
      }
    } catch (error) {
      console.error('Error toggling AI control:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (): Promise<void> => {
    if (!newMessage.trim() || !selectedConversation || loading) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://korraai.bitwavetechnologies.com/api/conversations/${selectedConversation.id}/messages/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${BEARER_TOKEN}`,
          },
          body: JSON.stringify({
            content: newMessage,
            message_type: 'text'
          }),
        }
      );
      
      if (response.ok) {
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isMobile) {
    return (
      <div className="h-full">
        {!showMessages ? (
          <ChatList 
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
            isMobile={isMobile}
          />
        ) : (
          <ChatMessages
            selectedConversation={selectedConversation}
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={sendMessage}
            toggleAIControl={toggleAIControl}
            loading={loading}
            onBack={handleBackToList}
            isMobile={isMobile}
          />
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex">
      <div className="w-80 border-r border-white/20">
        <ChatList 
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
          isMobile={isMobile}
        />
      </div>
      <ChatMessages
        selectedConversation={selectedConversation}
        messages={messages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
        toggleAIControl={toggleAIControl}
        loading={loading}
        onBack={handleBackToList}
        isMobile={isMobile}
      />
    </div>
  );
};

// Placeholder Components for other modules
const CallsModule: React.FC = () => (
  <div className="h-full flex items-center justify-center">
    <div className="text-center text-gray-400">
      <Phone size={48} className="mx-auto mb-4 opacity-50" />
      <h3 className="text-xl font-medium mb-2">Calls Module</h3>
      <p>Coming soon...</p>
    </div>
  </div>
);

const ContactsModule: React.FC = () => (
  <div className="h-full flex items-center justify-center">
    <div className="text-center text-gray-400">
      <Users size={48} className="mx-auto mb-4 opacity-50" />
      <h3 className="text-xl font-medium mb-2">Contacts Module</h3>
      <p>Coming soon...</p>
    </div>
  </div>
);

const DocumentsModule: React.FC = () => (
  <div className="h-full flex items-center justify-center">
    <div className="text-center text-gray-400">
      <FileText size={48} className="mx-auto mb-4 opacity-50" />
      <h3 className="text-xl font-medium mb-2">Documents Module</h3>
      <p>Coming soon...</p>
    </div>
  </div>
);

const SettingsModule: React.FC = () => (
  <div className="h-full flex items-center justify-center">
    <div className="text-center text-gray-400">
      <Settings size={48} className="mx-auto mb-4 opacity-50" />
      <h3 className="text-xl font-medium mb-2">Settings Module</h3>
      <p>Coming soon...</p>
    </div>
  </div>
);

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = (): void => {
      const mobile: boolean = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const renderContent = (): ReactElement => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'chats':
        return <ChatModule isMobile={isMobile} />;
      case 'calls':
        return <CallsModule />;
      case 'contacts':
        return <ContactsModule />;
      case 'documents':
        return <DocumentsModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      <div className="h-full flex">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobile={isMobile}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navigation */}
          <TopNav
            isMobile={isMobile}
            setSidebarOpen={setSidebarOpen}
          />

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;