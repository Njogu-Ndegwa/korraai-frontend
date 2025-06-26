'use client'
import { useState, useRef, useEffect, ReactElement } from "react";
import { useRouter, useParams } from 'next/navigation';
import {
    MessageCircle,
    Bot,
    User,
    Send,
    ArrowLeft,
    CheckCircle2,
    Circle,
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

import { authorizedFetch } from "../../../../authorizedFetch";

export default function MessagesPage() {
    const router = useRouter();
    const params = useParams();
    const conversationId = params.id as string;

    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isToggling, setIsToggling] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const wsConversations = useRef<WebSocket | null>(null);
    const wsMessages = useRef<WebSocket | null>(null);
    const USER_ID = "88280a92-7ab2-45ed-96b8-cc2fbd2ee539";
    const TENANT_ID = "49592c05-e4f6-4ae1-ba21-9e5034171ffa";
    const WS_BASE_URL = "wss://korraai.bitwavetechnologies.com/ws";

    // Load conversation details when component mounts
    useEffect(() => {
        if (!conversationId) return;

        // Set up conversations WebSocket to get conversation details
        const wsUrl = `${WS_BASE_URL}/conversations/?user_id=${USER_ID}&tenant_id=${TENANT_ID}`;
        wsConversations.current = new WebSocket(wsUrl);

        wsConversations.current.onopen = () => {
            console.log("Conversations WebSocket Connected for conversation details");
        };

        wsConversations.current.onmessage = (event) => {
            try {
                const response = JSON.parse(event.data);
                if (response.type === 'conversation_list' && response.data?.results) {
                    const conversation = response.data.results.find((conv: any) => conv.id === conversationId);
                    if (conversation) {
                        setSelectedConversation(mapApiConversationToState(conversation));
                    }
                } else if (response.type === 'conversation_updated' && response.conversation?.id === conversationId) {
                    setSelectedConversation(mapApiConversationToState(response.conversation));
                }
            } catch (error) {
                console.error("Error parsing conversation WebSocket message:", error);
            }
        };

        return () => {
            wsConversations.current?.close();
        };
    }, [conversationId]);

    // Effect to establish WebSocket for MESSAGES when a conversation is selected
    useEffect(() => {
        // If no conversation is selected, close any existing message socket and clear messages
        if (!conversationId) {
            wsMessages.current?.close();
            setMessages([]);
            return;
        }

        const wsUrl = `${WS_BASE_URL}/conversations/${conversationId}/messages/?user_id=${USER_ID}&tenant_id=${TENANT_ID}`;
        wsMessages.current = new WebSocket(wsUrl);

        wsMessages.current.onopen = () => console.log(`Messages WebSocket for ${conversationId} Connected`);
        wsMessages.current.onclose = () => console.log(`Messages WebSocket for ${conversationId} Disconnected`);
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
    }, [conversationId]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // --- Data Mapping Functions ---
    const mapApiConversationToState = (apiConv: ApiConversation): Conversation => {
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
        return {
            id: apiMsg.id,
            message_type: apiMsg.message_type,
            direction: apiMsg.direction,
            sender_type: apiMsg.sender_type === 'agent' ? 'human' : apiMsg.sender_type,
            sender_name: apiMsg.sender_name,
            content_encrypted: apiMsg.content_encrypted,
            platform_timestamp: apiMsg.platform_timestamp,
            is_read_by_current_user: apiMsg.is_read_by_current_user,
            delivery_status: apiMsg.delivery_status,
        };
    };

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

            // Update the selected conversation
            setSelectedConversation(updatedConv);

        } catch (err) {
            console.error('Error toggling AI control:', err);
            // Show user-friendly error message
            alert('Failed to toggle AI control. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToList = (): void => {
        router.push('/conversations');
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

    // Helper function to get message styling based on sender type
    const getMessageStyling = (message: Message) => {
        const isCustomer = message.sender_type === 'customer';
        const isAI = message.sender_type === 'ai';
        const isHuman = message.sender_type === 'human';
        const isUnread = !message.is_read_by_current_user && message.direction === 'inbound';

        // Placement logic
        let justifyClass = '';
        if (isCustomer) {
            justifyClass = 'justify-start'; // Customer messages on the left
        } else if (isAI) {
            justifyClass = 'justify-end'; // AI messages on the right
        } else if (isHuman) {
            justifyClass = 'justify-end'; // Human agent messages on the right (but styled differently from AI)
        }

        // Bubble styling
        let bubbleClass = '';
        if (isCustomer) {
            bubbleClass = `bg-white text-gray-900 border border-gray-200 shadow-sm ${isUnread ? 'ring-2 ring-blue-400' : ''}`;
        } else if (isAI) {
            bubbleClass = `bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/25 ${isUnread ? 'ring-2 ring-purple-400' : ''}`;
        } else if (isHuman) {
            bubbleClass = `bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 ${isUnread ? 'ring-2 ring-emerald-400' : ''}`;
        }

        return { justifyClass, bubbleClass, isCustomer, isAI, isHuman };
    };

    const handleToggleAI = async () => {
        if (!selectedConversation || isToggling) return;

        setIsToggling(true);
        try {
            await toggleAIControl();
        } catch (error) {
            console.error('Error toggling AI:', error);
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
                    <h3 className="text-2xl font-bold mb-2 text-gray-700">Loading conversation...</h3>
                    <p className="text-gray-500">Please wait while we load the conversation details</p>
                </div>
            </div>
        );
    }

    const customerName = selectedConversation.customer_name || 'Unknown';
    const platformName = selectedConversation.platform_name || 'Unknown Platform';
    const currentHandlerType = selectedConversation.current_handler_type || 'human';
    const aiEnabled = selectedConversation.ai_enabled ?? false;

    return (
        <div className="flex flex-col bg-white h-screen">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-white shadow-sm flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleBackToList}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors flex-shrink-0"
                            aria-label="Go back to conversations list"
                        >
                            <ArrowLeft size={24} className="text-gray-600" />
                        </button>

                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 flex-shrink-0">
                            {customerName.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="font-semibold text-gray-900 text-lg truncate">{customerName}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                                <span className="truncate">{platformName}</span>
                                {currentHandlerType === 'ai' ? (
                                    <span className="flex items-center gap-1 text-purple-600 font-medium flex-shrink-0">
                                        <Bot size={14} />
                                        AI Active
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-emerald-600 font-medium flex-shrink-0">
                                        <User size={14} />
                                        Human
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                            onClick={handleToggleAI}
                            disabled={loading || isToggling}
                            className={`px-4 py-2 text-sm rounded-xl font-medium transition-all ${aiEnabled
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

            {/* Messages - with proper scroll container */}
            <div className="flex-1 overflow-y-auto space-y-4 bg-gradient-to-b from-gray-50 to-white p-6">
                {messages && messages.length > 0 ? (
                    messages.map((message: Message) => {
                        if (!message || !message.id) return null;

                        const { justifyClass, bubbleClass, isCustomer, isAI, isHuman } = getMessageStyling(message);
                        const isUnread = !message.is_read_by_current_user && message.direction === 'inbound';
                        const senderName = message.sender_name || (isAI ? 'AI Assistant' : isHuman ? 'Agent' : 'Customer');

                        return (
                            <div
                                key={message.id}
                                className={`flex ${justifyClass} animate-fadeIn`}
                            >
                                <div className="max-w-[70%]">
                                    {/* Sender info */}
                                    <div className={`flex items-center gap-2 mb-2 text-xs ${isCustomer ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`flex items-center gap-2 ${isCustomer ? 'text-gray-500' : isAI ? 'text-purple-200' : 'text-emerald-200'}`}>
                                            {isCustomer && <User size={14} />}
                                            {isAI && <Bot size={14} />}
                                            {isHuman && <User size={14} />}
                                            <span className="font-medium">{senderName}</span>
                                            {isAI && <span className="text-purple-300 font-bold">✨ AI</span>}
                                            {isHuman && <span className="text-emerald-300 font-bold">👤 Agent</span>}
                                        </div>
                                    </div>

                                    {/* Message bubble */}
                                    <div className={`p-4 rounded-2xl ${bubbleClass}`}>
                                        {renderMessageContent(message.content_encrypted || '')}
                                    </div>

                                    {/* Message footer */}
                                    <div className={`flex items-center gap-2 mt-2 text-xs text-gray-500 ${isCustomer ? 'justify-start' : 'justify-end'}`}>
                                        <span>{formatTime(message.platform_timestamp)}</span>
                                        {(isAI || isHuman) && (
                                            <div className="flex items-center gap-1">
                                                {message.delivery_status === 'delivered' || message.delivery_status === 'sent' ? (
                                                    <CheckCircle2 size={14} className="text-green-500" />
                                                ) : message.delivery_status === 'sending' ? (
                                                    <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <Circle size={14} />
                                                )}
                                            </div>
                                        )}
                                        {isUnread && (
                                            <span className={`font-bold ${isCustomer ? 'text-blue-600' : 'text-orange-600'}`}>New</span>
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
                <div className="border-t border-gray-100 bg-white flex-shrink-0 p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                            <User size={16} />
                            <span>You're handling this conversation</span>
                        </div>
                    </div>
                    <div className="flex items-end gap-3">
                        <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
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
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl transition-all shadow-lg shadow-emerald-500/25 group p-4"
                        >
                            <Send size={20} className="text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            ) : (
                /* AI Banner */
                <div className="border-t border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50 flex-shrink-0 p-6">
                    <div className="flex items-center justify-center gap-3 text-purple-700">
                        <Bot size={20} className="animate-pulse" />
                        <span className="font-medium">AI is handling this conversation</span>
                        <Sparkles size={16} className="text-purple-500" />
                    </div>
                </div>
            )}
        </div>
    );
}