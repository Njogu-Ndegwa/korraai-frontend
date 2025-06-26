'use client'
import { useState, useRef, useEffect, ReactElement } from "react";

import {
    MessageCircle,
    Search,
    Bot,
    User,
    Send,
    ArrowLeft,
    CheckCircle2,
    Circle,
    Plus,
    MoreHorizontal,
    Sparkles
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
    sender_type: 'customer' | 'human' | 'ai';
    sender_name: string;
    content_encrypted: string;
    platform_timestamp: string;
    is_read_by_current_user: boolean;
    delivery_status: string;
}

interface ChatModuleProps {
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

// Interfaces for API response data
interface ApiConversation {
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

interface ApiMessage {
    id: string;
    message_type: string;
    direction: 'inbound' | 'outbound';
    sender_type: 'customer' | 'agent' | 'ai'; // 'agent' from API maps to 'human'
    sender_name: string;
    content_encrypted: string;
    platform_timestamp: string;
    is_read_by_current_user: boolean;
    delivery_status: string;
}
import { authorizedFetch } from "./authorizedFetch";
export const ChatModule: React.FC<ChatModuleProps> = ({ isMobile }) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [showMessages, setShowMessages] = useState<boolean>(!isMobile);

    const wsConversations = useRef<WebSocket | null>(null);
    const wsMessages = useRef<WebSocket | null>(null);
    const USER_ID = "88280a92-7ab2-45ed-96b8-cc2fbd2ee539";
    const TENANT_ID = "49592c05-e4f6-4ae1-ba21-9e5034171ffa";
    const WS_BASE_URL = "wss://korraai.bitwavetechnologies.com/ws";
    // Effect to establish WebSocket for CONVERSATIONS list
    // Replace your WebSocket setup with this enhanced version that includes better debugging:

    // Add these state variables to track connection status
    const [wsConnectionStatus, setWsConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
    const [connectionRetries, setConnectionRetries] = useState(0);
    const maxRetries = 3;

    // Enhanced conversations WebSocket setup
    useEffect(() => {
        let retryTimeout: NodeJS.Timeout;

        const connectConversationsWS = () => {
            if (connectionRetries >= maxRetries) {
                console.log('Max connection retries reached, stopping attempts');
                setWsConnectionStatus('error');
                return;
            }

            console.log(`Attempting to connect to conversations WebSocket (attempt ${connectionRetries + 1})`);
            setWsConnectionStatus('connecting');

            const wsUrl = `${WS_BASE_URL}/conversations/?user_id=${USER_ID}&tenant_id=${TENANT_ID}`;
            console.log('WebSocket URL:', wsUrl);

            try {
                wsConversations.current = new WebSocket(wsUrl);
            } catch (error) {
                console.error('Failed to create WebSocket:', error);
                setWsConnectionStatus('error');
                return;
            }

            wsConversations.current.onopen = () => {
                console.log("Conversations WebSocket Connected successfully");
                setWsConnectionStatus('connected');
                setConnectionRetries(0); // Reset retry counter on successful connection
            };

            wsConversations.current.onclose = (event) => {
                console.log("Conversations WebSocket Disconnected", {
                    code: event.code,
                    reason: event.reason,
                    wasClean: event.wasClean
                });
                setWsConnectionStatus('disconnected');

                // Auto-reconnect logic
                if (event.code !== 1000 && connectionRetries < maxRetries) {
                    console.log(`Reconnecting in 3 seconds... (attempt ${connectionRetries + 1}/${maxRetries})`);
                    setConnectionRetries(prev => prev + 1);
                    retryTimeout = setTimeout(connectConversationsWS, 3000);
                }
            };

            wsConversations.current.onerror = (error) => {
                console.error("Conversations WebSocket Error Details:", {
                    error: error,
                    type: error.type,
                    target: error.target,
                    readyState: wsConversations.current?.readyState,
                    url: wsUrl
                });
                setWsConnectionStatus('error');

                // Check if it's a network/connection issue
                if (wsConversations.current?.readyState === WebSocket.CONNECTING) {
                    console.error('WebSocket failed to connect - check URL and server availability');
                }
            };

            wsConversations.current.onmessage = (event) => {
                try {
                    console.log('📨 Received conversations message:', event.data);
                    const response = JSON.parse(event.data);

                    if (response.type === 'conversation_list' && response.data?.results) {
                        const mappedConversations = response.data.results.map(mapApiConversationToState);
                        setConversations(prev => {
                            const updatedConversations = new Map(prev.map(c => [c.id, c]));
                            mappedConversations.forEach((conv: Conversation) => updatedConversations.set(conv.id, conv));
                            return Array.from(updatedConversations.values());
                        });
                    } else if (response.type === 'conversation_updated') {
                        // Your backend sends 'conversation_updated'
                        if (response.conversation) {
                            const updatedConv = mapApiConversationToState(response.conversation);
                            setConversations(prev => {
                                const updated = prev.map(c => c.id === updatedConv.id ? updatedConv : c);
                                if (!prev.find(c => c.id === updatedConv.id)) {
                                    updated.push(updatedConv);
                                }
                                return updated;
                            });

                            setSelectedConversation(prev =>
                                prev?.id === updatedConv.id ? updatedConv : prev
                            );
                            console.log(`🔄 Updated conversation: ${updatedConv.customer_name}`);
                        }
                    } else if (response.type === 'new_message') {
                        // Handle new message notifications
                        console.log(`📨 New message notification for conversation: ${response.conversation_id}`);
                    } else {
                        console.log('📥 Unknown conversation message type:', response.type, response);
                    }
                } catch (parseError) {
                    console.error("❌ Error parsing conversations WebSocket message:", parseError, event.data);
                }
            };

        };

        // Initial connection
        connectConversationsWS();

        // Cleanup function
        return () => {
            if (retryTimeout) {
                clearTimeout(retryTimeout);
            }
            if (wsConversations.current) {
                console.log('Closing conversations WebSocket');
                wsConversations.current.close(1000, "Component unmounting");
            }
        };
    }, []);

    // Improved toggleAIControl with better error handling:
    const toggleAIControl = async (): Promise<void> => {
        if (!selectedConversation) return;

        console.log(`Toggling AI control for conversation ${selectedConversation.id} from ${selectedConversation.ai_enabled} to ${!selectedConversation.ai_enabled}`);

        setLoading(true);
        const newAiEnabledStatus = !selectedConversation.ai_enabled;

        try {
            const response = await authorizedFetch(`/conversations/${selectedConversation.id}/ai-control/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ai_enabled: newAiEnabledStatus })
            });

            if (!response.conversation) {
                throw new Error('Invalid response from AI control toggle');
            }

            const updatedConv = mapApiConversationToState(response.conversation);
            console.log('AI control toggled successfully:', updatedConv);

            // Update the selected conversation and the list
            setSelectedConversation(updatedConv);
            setConversations(prev =>
                prev.map(c => c.id === updatedConv.id ? updatedConv : c)
            );

        } catch (err) {
            console.error('Error toggling AI control:', err);
            // Show user-friendly error message
            alert('Failed to toggle AI control. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // --- Data Mapping Functions ---
    const mapApiConversationToState = (apiConv: ApiConversation): Conversation => {
        // This function maps the raw API conversation object to the Conversation type used by your components.
        // Add any transformations needed here. For now, it's a direct mapping.
        return {
            id: apiConv.id,
            customer_name: apiConv.customer_name,
            customer_platform_username: apiConv.customer_platform_username,
            platform_name: apiConv.platform_name,
            account_name: apiConv.account_name,
            current_handler_type: apiConv.current_handler_type,
            ai_enabled: apiConv.ai_enabled,
            status: apiConv.status,
            priority: apiConv.priority,
            message_count: apiConv.message_count,
            unread_count: apiConv.unread_count,
            last_message_preview: apiConv.last_message_preview,
            time_since_last_message: apiConv.time_since_last_message,
            last_message_at: apiConv.last_message_at,
        };
    };

    const mapApiMessageToState = (apiMsg: ApiMessage): Message => {
        // This function maps the raw API message object to the Message type.
        // Note the important change from 'agent' to 'human'.
        return {
            id: apiMsg.id,
            message_type: apiMsg.message_type,
            direction: apiMsg.direction,
            // Translate the sender_type from the API ('agent') to what the UI expects ('human')
            sender_type: apiMsg.sender_type === 'agent' ? 'human' : apiMsg.sender_type,
            sender_name: apiMsg.sender_name,
            content_encrypted: apiMsg.content_encrypted,
            platform_timestamp: apiMsg.platform_timestamp,
            is_read_by_current_user: apiMsg.is_read_by_current_user,
            delivery_status: apiMsg.delivery_status,
        };
    };
    // Effect to establish WebSocket for MESSAGES when a conversation is selected
    useEffect(() => {
        // If no conversation is selected, close any existing message socket and clear messages
        if (!selectedConversation) {
            wsMessages.current?.close();
            setMessages([]);
            return;
        }

        const wsUrl = `${WS_BASE_URL}/conversations/${selectedConversation.id}/messages/?user_id=${USER_ID}&tenant_id=${TENANT_ID}`;
        wsMessages.current = new WebSocket(wsUrl);

        wsMessages.current.onopen = () => console.log(`Messages WebSocket for ${selectedConversation.id} Connected`);
        wsMessages.current.onclose = () => console.log(`Messages WebSocket for ${selectedConversation.id} Disconnected`);
        wsMessages.current.onerror = (err) => console.error("Messages WS Error:", err);

        wsMessages.current.onmessage = (event) => {
            try {
                console.log('📨 Received messages data:', event.data);
                const response = JSON.parse(event.data);

                if (response.type === 'messages_list') {
                    if (response.data?.results) {
                        const mappedMessages = response.data.results.map(mapApiMessageToState);
                        const sortedMessages = mappedMessages.sort((a: any, b: any) =>
                            new Date(a.platform_timestamp).getTime() - new Date(b.platform_timestamp).getTime()
                        );
                        setMessages(sortedMessages);
                        console.log(`📋 Loaded messages list: ${mappedMessages.length} items`);
                    }
                } else if (response.type === 'new_message_received') {
                    if (response.message) {
                        const newMessage = mapApiMessageToState(response.message);
                        setMessages(prevMessages => {
                            const messageMap = new Map(prevMessages.map(m => [m.id, m]));
                            messageMap.set(newMessage.id, newMessage);
                            return Array.from(messageMap.values()).sort((a, b) =>
                                new Date(a.platform_timestamp).getTime() - new Date(b.platform_timestamp).getTime()
                            );
                        });
                        console.log(`📨 Received new message:`, newMessage.content_encrypted?.substring(0, 50) + '...');
                    }
                } else if (response.type === 'message_update') {
                    const data = response.data?.results || [response.data];
                    const mappedMessages = data.map(mapApiMessageToState);
                    setMessages(prevMessages => {
                        const messageMap = new Map(prevMessages.map(m => [m.id, m]));
                        mappedMessages.forEach((m: any) => messageMap.set(m.id, m));
                        return Array.from(messageMap.values()).sort((a, b) =>
                            new Date(a.platform_timestamp).getTime() - new Date(b.platform_timestamp).getTime()
                        );
                    });
                } else {
                    console.log('📥 Unknown message type:', response.type, response);
                }
            } catch (parseError) {
                console.error("❌ Error parsing messages WebSocket message:", parseError, event.data);
            }
        };

        // Cleanup on conversation change or component unmount
        return () => {
            wsMessages.current?.close();
        };
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

    const sendMessage = async (): Promise<void> => {
        if (!newMessage.trim() || !selectedConversation) return;

        // Optimistic UI update
        const optimisticMessage: Message = {
            id: `temp_${Date.now()}`,
            message_type: 'text',
            direction: 'outbound',
            sender_type: 'human',
            sender_name: 'You', // Or get current user name
            content_encrypted: newMessage,
            platform_timestamp: new Date().toISOString(),
            is_read_by_current_user: true,
            delivery_status: 'sending'
        };

        setMessages(prev => [...prev, optimisticMessage]);
        setNewMessage('');

        try {
            // The WebSocket will push the real message update, including correct ID and status.
            // We just need to fire the request.
            await authorizedFetch(`/conversations/${selectedConversation.id}/messages/`, {
                method: 'POST',
                body: JSON.stringify({ content: newMessage, message_type: 'text' })
            });
        } catch (err) {
            // Handle failed message state
            setMessages(prev => prev.map(m =>
                m.id === optimisticMessage.id ? { ...m, delivery_status: 'failed' } : m
            ));
        }
    };

    if (isMobile) {
        return (
            <div className="h-full">
                {!showMessages || !selectedConversation ? (
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
            <div className="w-96 border-r border-gray-100">
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

interface ChatListProps {
    conversations: Conversation[];
    selectedConversation: Conversation | null;
    onSelectConversation: (conversation: Conversation) => void;
    isMobile: boolean;
}


// Chat List Component
export const ChatList: React.FC<ChatListProps> = ({ conversations, selectedConversation, onSelectConversation, isMobile }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [activeFilter, setActiveFilter] = useState<string>('all');

    const [isLoadingConversations, setIsLoadingConversations] = useState<boolean>(true);

    useEffect(() => {
        if (conversations.length > 0) {
            setIsLoadingConversations(false);
        }
    }, [conversations]);

    const filteredConversations: Conversation[] = isLoadingConversations
        ? []
        : conversations.filter((conv: Conversation) =>
            (conv.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
            (conv.last_message_preview?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
        );


    const formatRelativeTime = (minutes: number): string => {
        if (minutes < 60) return `${minutes}m`;
        if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
        return `${Math.floor(minutes / 1440)}d`;
    };

    const getPlatformColor = (platform: string): string => {
        const colors: { [key: string]: string } = {
            'WhatsApp Messenger': 'bg-green-500',
            'Facebook': 'bg-blue-600',
            'Instagram': 'bg-gradient-to-br from-purple-600 to-pink-600',
            'Twitter': 'bg-sky-500',
            'default': 'bg-gray-500'
        };
        return colors[platform] || colors.default;
    };

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
                    <button className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl transition-all shadow-lg shadow-indigo-500/25 group">
                        <Plus size={20} className="text-white group-hover:rotate-90 transition-transform" />
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                </div>

                {/* Filter buttons */}
                <div className="flex gap-2">
                    {['all', 'unread', 'ai'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeFilter === filter
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation: Conversation) => (
                    <div
                        key={conversation.id}
                        onClick={() => onSelectConversation(conversation)}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-all ${selectedConversation?.id === conversation.id ? 'bg-indigo-50 border-indigo-200' : ''
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <div className="relative flex-shrink-0">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
                                    {conversation.customer_name.charAt(0)}
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${conversation.current_handler_type === 'ai' ? 'bg-purple-500' : 'bg-emerald-500'
                                    } flex items-center justify-center shadow-md`}>
                                    {conversation.current_handler_type === 'ai' ?
                                        <Bot size={10} className="text-white" /> :
                                        <User size={10} className="text-white" />
                                    }
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-900 truncate">{conversation.customer_name}</span>
                                        <span className={`text-xs px-2 py-1 rounded-full text-white font-medium ${getPlatformColor(conversation.platform_name)}`}>
                                            {conversation.platform_name === "WhatsApp Messenger" ? "WhatsApp" : conversation.platform_name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-xs text-gray-500">
                                            {formatRelativeTime(conversation.time_since_last_message)}
                                        </span>
                                        {conversation.unread_count > 0 && (
                                            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-5 text-center font-bold animate-pulse">
                                                {conversation.unread_count}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 truncate">
                                    {conversation.last_message_preview}
                                </div>
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
    const [isToggling, setIsToggling] = useState(false);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const formatTime = (timestamp: string): string => {
        if (!timestamp) return '';
        try {
            const date = new Date(timestamp);
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (error) {
            console.error('Error formatting time:', error);
            return '';
        }
    };

    const renderMessageContent = (content: string): ReactElement => {
        if (!content) return <div></div>;

        try {
            let formatted: string = content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br>')
                .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800 underline">$1</a>');

            return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
        } catch (error) {
            console.error('Error rendering message content:', error);
            return <div>{content}</div>;
        }
    };

    const handleToggleAI = async () => {
        if (!selectedConversation || isToggling) return;

        setIsToggling(true);
        try {
            await toggleAIControl();
        } catch (error) {
            console.error('Error toggling AI:', error);
            // You might want to show a toast notification here
        } finally {
            setIsToggling(false);
        }
    };

    // Safety check for selectedConversation
    if (!selectedConversation) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-500">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle size={32} className="text-gray-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-gray-700">Select a conversation</h3>
                    <p className="text-gray-500">Choose a conversation to start messaging</p>
                </div>
            </div>
        );
    }

    // Additional safety checks
    const customerName = selectedConversation.customer_name || 'Unknown';
    const platformName = selectedConversation.platform_name || 'Unknown Platform';
    const currentHandlerType = selectedConversation.current_handler_type || 'human';
    const aiEnabled = selectedConversation.ai_enabled ?? false;

    return (
        <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 bg-white shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {isMobile && (
                            <button
                                onClick={onBack}
                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                        )}

                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
                            {customerName.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <div className="font-semibold text-gray-900 text-lg">{customerName}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                                {platformName}
                                {currentHandlerType === 'ai' ? (
                                    <span className="flex items-center gap-1 text-purple-600 font-medium">
                                        <Bot size={14} />
                                        AI Active
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                                        <User size={14} />
                                        Human
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleToggleAI}
                            disabled={loading || isToggling}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${aiEnabled
                                ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isToggling ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                    {aiEnabled ? 'Disabling...' : 'Enabling...'}
                                </span>
                            ) : (
                                aiEnabled ? '🤖 Disable AI' : '✨ Enable AI'
                            )}
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                {messages && messages.length > 0 ? (
                    messages.map((message: Message) => {
                        if (!message || !message.id) return null;

                        const isOutbound: boolean = message.direction === 'outbound';
                        const isAI: boolean = message.sender_type === 'ai';
                        const isUnread: boolean = !message.is_read_by_current_user && message.direction === 'inbound';
                        const senderName = message.sender_name || (isAI ? 'AI Assistant' : 'Customer');

                        return (
                            <div
                                key={message.id}
                                className={`flex ${isOutbound ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                            >
                                <div className={`max-w-[70%] ${isMobile ? 'max-w-[85%]' : ''}`}>
                                    {!isOutbound && (
                                        <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                                            {isAI ? <Bot size={14} /> : <User size={14} />}
                                            <span className="font-medium">{senderName}</span>
                                            {isAI && <span className="text-purple-600 font-bold">✨ AI</span>}
                                        </div>
                                    )}

                                    <div
                                        className={`p-4 rounded-2xl shadow-sm ${isOutbound
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                                            : isAI
                                                ? `bg-gradient-to-r from-purple-50 to-pink-50 text-gray-900 border border-purple-200 ${isUnread ? 'ring-2 ring-orange-400' : ''}`
                                                : `bg-white text-gray-900 border border-gray-200 ${isUnread ? 'ring-2 ring-orange-400' : ''}`
                                            }`}
                                    >
                                        {renderMessageContent(message.content_encrypted || '')}
                                    </div>

                                    <div className={`flex items-center gap-2 mt-2 text-xs text-gray-500 ${isOutbound ? 'justify-end' : 'justify-start'}`}>
                                        <span>{formatTime(message.platform_timestamp)}</span>
                                        {isOutbound && (
                                            <div className="flex items-center gap-1">
                                                {message.delivery_status === 'sent' ? (
                                                    <CheckCircle2 size={14} className="text-green-500" />
                                                ) : (
                                                    <Circle size={14} />
                                                )}
                                            </div>
                                        )}
                                        {isUnread && (
                                            <span className="text-orange-600 font-bold">New</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
                            <p>No messages yet</p>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            {currentHandlerType === 'human' ? (
                <div className="p-6 border-t border-gray-100 bg-white">
                    <div className="flex items-end gap-3">
                        <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                            <textarea
                                value={newMessage}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="w-full p-4 bg-transparent text-gray-900 placeholder-gray-500 resize-none focus:outline-none rounded-2xl"
                                rows={3}
                                onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                                disabled={loading || isToggling}
                            />
                        </div>
                        <button
                            onClick={sendMessage}
                            disabled={loading || !newMessage.trim() || isToggling}
                            className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl transition-all shadow-lg shadow-indigo-500/25 group"
                        >
                            <Send size={20} className="text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                    <div className="flex items-center justify-center gap-3 text-purple-700">
                        <Bot size={20} className="animate-pulse" />
                        <span className="font-medium">AI is handling this conversation</span>
                        <Sparkles size={16} className="text-purple-500" />
                    </div>
                </div>
            )}
        </div>
    );
};
